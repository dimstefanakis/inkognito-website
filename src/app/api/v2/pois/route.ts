import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";
export const maxDuration = 60;

const FETCH_RADIUS = 300; // meters
const MAX_AGE_DAYS = 30;
const OSM_OVERPASS_API = "https://overpass-api.de/api/interpreter";

interface OSMElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: {
    name?: string;
    amenity?: string;
    shop?: string;
    tourism?: string;
    leisure?: string;
    [key: string]: string | undefined;
  };
}

async function shouldFetchPOIs(lat: number, lng: number): Promise<boolean> {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.rpc("check_poi_fetch_needed", {
      check_lat: lat,
      check_lng: lng,
      check_radius: FETCH_RADIUS,
      max_age_days: MAX_AGE_DAYS,
    });

    if (error) {
      console.error("Error checking POI fetch status:", error);
      return false;
    }
    return !!data;
  } catch (error) {
    console.error("Error checking POI fetch status:", error);
    return false;
  }
}

async function fetchOSMPlaces(lat: number, lng: number): Promise<OSMElement[]> {
  const query = `
    [out:json][timeout:25];
    (
      node["name"]["amenity"](around:${FETCH_RADIUS},${lat},${lng});
      node["name"]["shop"](around:${FETCH_RADIUS},${lat},${lng});
      node["name"]["tourism"](around:${FETCH_RADIUS},${lat},${lng});
      node["name"]["leisure"](around:${FETCH_RADIUS},${lat},${lng});
    );
    out body;
  `;

  // Create AbortController with 10 second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(OSM_OVERPASS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSM API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.error("OSM API request timed out after 10 seconds");
    } else {
      console.error("Error fetching from OSM:", error);
    }
    return [];
  }
}

function mapOSMToCategory(tags: OSMElement["tags"]): string {
  if (!tags) return "other";

  const categoryMap: Record<string, string[]> = {
    nightlife: ["bar", "pub", "nightclub", "casino"],
    dating: ["cinema", "park", "cafe"],
    work_money: ["bank", "atm", "office", "coworking_space"],
    shopping_fashion: [
      "clothes",
      "shoes",
      "jewelry",
      "mall",
      "department_store",
      "supermarket",
    ],
    travel_tourism: [
      "hotel",
      "motel",
      "guest_house",
      "attraction",
      "museum",
      "gallery",
    ],
    health_wellness: [
      "gym",
      "fitness_centre",
      "spa",
      "hospital",
      "pharmacy",
      "doctors",
    ],
    education_school: ["school", "university", "college", "library"],
    family_parenting: ["playground", "kindergarten", "toy_shop"],
    outdoor_nature: ["park", "garden", "nature_reserve", "beach"],
    faith_spirituality: ["place_of_worship", "church", "mosque", "temple"],
    entertainment: ["cinema", "theatre", "concert_hall", "stadium"],
    sports: ["sports_centre", "swimming_pool", "golf_course", "tennis_court"],
    food_drinks: ["restaurant", "cafe", "fast_food", "bar", "pub"],
    tech_gadgets: ["electronics", "computer", "mobile_phone"],
    pets_animals: ["pet", "veterinary", "pet_shop"],
    home_living: ["furniture", "hardware", "garden_centre"],
  };

  const osmTags = Object.values(tags)
    .filter(Boolean)
    .map((t) => (t ? t.toLowerCase() : ""));

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (
      keywords.some((keyword) => osmTags.some((tag) => tag.includes(keyword)))
    ) {
      return category;
    }
  }

  return "other";
}

function getOSMTypes(tags: OSMElement["tags"]): string[] {
  if (!tags) return [];

  const types = [];
  if (tags.amenity) types.push(tags.amenity);
  if (tags.shop) types.push(tags.shop);
  if (tags.tourism) types.push(tags.tourism);
  if (tags.leisure) types.push(tags.leisure);

  return types;
}

async function savePOIs(places: OSMElement[], lat: number, lng: number) {
  const supabase = await createClient();

  const poisToInsert = places
    .filter((place) => place.lat && place.lon && place.tags?.name)
    .map((place) => ({
      name: place.tags!.name!,
      category: mapOSMToCategory(place.tags),
      types: getOSMTypes(place.tags),
      lat: place.lat!,
      lng: place.lon!,
      geom: `POINT(${place.lon} ${place.lat})`,
      updated_at: new Date().toISOString(),
    }));

  if (poisToInsert.length > 0) {
    // Batch insert all POIs at once
    try {
      const { error: insertError } = await supabase
        .from("pois")
        .upsert(poisToInsert, {
          onConflict: "name,lat,lng",
          ignoreDuplicates: true,
        });

      if (insertError) {
        console.error("Error batch inserting POIs:", insertError);
        // Try fallback: insert without upsert
        const { error: fallbackError } = await supabase
          .from("pois")
          .insert(poisToInsert)
          .select();

        if (fallbackError && !fallbackError.message.includes("duplicate")) {
          console.error("Error in fallback POI insert:", fallbackError);
        }
      }
    } catch (error) {
      console.error("Error saving POIs:", error);
    }
  }

  // Record the fetch history
  try {
    const { error: historyError } = await supabase
      .from("poi_fetch_history")
      .insert({
        lat: lat,
        lng: lng,
        radius: FETCH_RADIUS,
        source: "openstreetmap",
        geom: `POINT(${lng} ${lat})`,
      });

    if (historyError) {
      console.error("Error recording fetch history:", historyError);
    }
  } catch (error) {
    console.error("Error in fetch history:", error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];

    // Create supabase client and verify token
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 },
      );
    }

    // Get lat/lng from query params
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json(
        { error: "Missing required parameters: lat, lng" },
        { status: 400 },
      );
    }

    // Validate lat/lng are valid numbers
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (isNaN(userLat) || isNaN(userLng)) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 },
      );
    }

    // First, get existing POIs from database
    const { data: pois, error: rpcError } = await supabase.rpc(
      "get_closest_pois",
      {
        input_user_id: user.id,
        user_lat: userLat,
        user_lng: userLng,
      },
    );

    if (rpcError) {
      console.error("Error fetching POIs:", rpcError);
      return NextResponse.json(
        { error: "Failed to fetch POIs" },
        { status: 500 },
      );
    }

    // Check if we need to fetch new POIs from OpenStreetMap
    const shouldFetch = await shouldFetchPOIs(userLat, userLng);

    if (shouldFetch) {
      // Fire and forget: Update POIs in background
      // This won't block the response
      try {
        const osmPlaces = await fetchOSMPlaces(userLat, userLng);
        if (osmPlaces.length > 0) {
          await savePOIs(osmPlaces, userLat, userLng);
        }
      } catch (error) {
        console.error("Background POI update failed:", error);
      }
    }

    // Return existing POIs immediately
    return NextResponse.json({ data: pois || [] });
  } catch (error) {
    console.error("Unexpected error in POIs endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
