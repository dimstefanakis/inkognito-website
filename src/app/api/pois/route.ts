import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "../../../../types_db";

export const runtime = "edge";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const FETCH_RADIUS = 100;
const MAX_AGE_DAYS = 30;

interface PlaceResult {
  place_id: string;
  name: string;
  primary_type: string;
  primary_type_display_name: string;
  types: string[];
  photos: string[];
  icon_mask_base_uri: string;
  icon_background_color: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GooglePlace {
  id: string;
  displayName: { text: string };
  primaryTypeDisplayName: { text: string };
  iconMaskBaseUri: string;
  iconBackgroundColor: string;
  types: string[];
  primaryType: string;
  photos: string[];
  location: { latitude: number; longitude: number };
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

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking POI fetch status:", error);
    return false;
  }
}

async function fetchGooglePlaces(
  lat: number,
  lng: number
): Promise<PlaceResult[]> {
  const response = await fetch(
    `https://places.googleapis.com/v1/places:searchNearby` +
    `?fields=places.displayName,places.id,places.types,places.location,places.photos,places.primaryType,places.primaryTypeDisplayName,places.iconMaskBaseUri,places.iconBackgroundColor`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask":
          "places.displayName,places.id,places.types,places.primaryType,places.displayName,places.location,places.photos",
      },
      body: JSON.stringify({
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: FETCH_RADIUS,
          },
        },
        includedTypes: [
          "restaurant",
          "bar",
          "cafe",
          "night_club",
          "movie_theater",
          "park",
          "shopping_mall",
          "gym",
          "tourist_attraction",
          "store",
          "airport",
          "internet_cafe",
        ],
      }),
    }
  );

  const data = await response.json();
  return (data.places || []).map((place: GooglePlace) => ({
    place_id: place.id,
    name: place.displayName?.text || "",
    primary_type_display_name: place.primaryTypeDisplayName?.text || "",
    icon_mask_base_uri: place.iconMaskBaseUri,
    icon_background_color: place.iconBackgroundColor || "",
    types: place.types || [],
    primary_type: place.primaryType,
    photos: place.photos || [],
    geometry: {
      location: {
        lat: place.location?.latitude || 0,
        lng: place.location?.longitude || 0,
      },
    },
  }));
}

function mapGooglePlaceToCategory(types: string[]): string {
  const categoryMap: Record<string, string[]> = {
    nightlife: ["bar", "night_club", "casino", "liquor_store"],
    dating: ["movie_theater", "park"],
    work_money: [
      "bank",
      "atm",
      "insurance_agency",
      "real_estate_agency",
      "coworking_space",
      "office",
      "accounting",
      "lawyer",
    ],
    shopping_fashion: [
      "shopping_mall",
      "store",
      "supermarket",
      "convenience_store",
      "clothing_store",
      "shoe_store",
      "jewelry_store",
      "department_store",
      "beauty_salon",
      "hair_salon",
    ],
    travel_tourism: [
      "airport",
      "bus_station",
      "train_station",
      "subway_station",
      "taxi_stand",
      "car_rental",
      "hotel",
      "motel",
      "resort_hotel",
      "guest_house",
      "bed_and_breakfast",
      "tourist_attraction",
      "landmark",
      "amusement_park",
      "zoo",
      "museum",
      "art_gallery",
      "travel_agency",
    ],
    health_wellness: [
      "gym",
      "fitness_center",
      "spa",
      "doctor",
      "hospital",
      "pharmacy",
      "dentist",
      "mental_health",
      "therapy_center",
      "nutritionist",
      "physiotherapist",
    ],
    education_school: [
      "school",
      "university",
      "college",
      "library",
      "primary_school",
      "secondary_school",
      "preschool",
      "student_dormitory",
      "book_store",
      "tutoring_center",
    ],
    family_parenting: [
      "playground",
      "child_care",
      "preschool",
      "family_center",
      "toy_store",
      "baby_store",
      "amusement_park",
    ],
    outdoor_nature: [
      "park",
      "national_park",
      "state_park",
      "campground",
      "hiking_area",
      "botanical_garden",
      "beach",
      "lake",
      "water_park",
      "picnic_ground",
    ],
    faith_spirituality: [
      "church",
      "mosque",
      "synagogue",
      "hindu_temple",
      "place_of_worship",
    ],
    crime_law: ["police", "lawyer", "fire_station", "jail", "court_house"],
    entertainment: [
      "movie_theater",
      "bowling_alley",
      "stadium",
      "theater",
      "concert_hall",
      "performing_arts_theater",
      "video_arcade",
      "escape_room",
      "event_venue",
    ],
    sports: [
      "sports_complex",
      "swimming_pool",
      "golf_course",
      "athletic_field",
      "sports_club",
      "skate_park",
      "tennis_court",
      "basketball_court",
      "shooting_range",
    ],
    vehicles: [
      "gas_station",
      "car_rental",
      "car_repair",
      "car_wash",
      "motorcycle_dealer",
      "bicycle_store",
      "electric_vehicle_charging_station",
    ],
    food_drinks: [
      "food_court",
      "fast_food_restaurant",
      "coffee_shop",
      "ice_cream_shop",
      "diner",
      "pizza_restaurant",
      "sushi_restaurant",
      "barbecue_restaurant",
      "steak_house",
      "seafood_restaurant",
      "thai_restaurant",
      "mexican_restaurant",
      "indian_restaurant",
      "chinese_restaurant",
      "japanese_restaurant",
      "mediterranean_restaurant",
      "american_restaurant",
      "bakery",
      "cafe",
      "restaurant",
    ],
    tech_gadgets: [
      "electronics_store",
      "computer_store",
      "mobile_phone_store",
      "gaming_store",
      "repair_service",
    ],
    pets_animals: [
      "pet_store",
      "veterinary_care",
      "animal_shelter",
      "dog_park",
    ],
    home_living: [
      "hardware_store",
      "furniture_store",
      "home_goods_store",
      "garden_center",
      "appliance_store",
      "lighting_store",
      "interior_design_store",
    ],
    events_parties: [
      "event_venue",
      "wedding_venue",
      "conference_center",
      "convention_center",
    ],
    transportation: [
      "bus_station",
      "train_station",
      "subway_station",
      "taxi_stand",
      "parking",
      "transit_station",
      "airport",
    ],
    internet_services: ["internet_cafe", "co_working_space", "post_office"],
    government_services: ["city_hall", "embassy", "courthouse"],
    emergency_services: ["hospital", "police", "fire_station"],
    community_social: ["community_center", "youth_center", "senior_center"],
    media_communications: ["news_agency", "tv_station", "radio_station"],
  };

  for (const [category, matchTypes] of Object.entries(categoryMap)) {
    if (types.some((type) => matchTypes.includes(type))) {
      return category;
    }
  }

  return "other";
}

async function savePOIs(places: PlaceResult[], lat: number, lng: number) {
  const supabase = await createClient();
  let pois = [] as Tables<"pois">[];
  await supabase
    .from("pois")
    .select("google_place_id");

  const poisToUpsert = places.map((place) => ({
    google_place_id: place.place_id,
    name: place.name,
    category: mapGooglePlaceToCategory(place.types),
    types: place.types,
    photos: place.photos,
    icon_mask_base_uri: place.icon_mask_base_uri,
    icon_background_color: place.icon_background_color,
    primary_type: place.primary_type,
    primary_type_display_name: place.primary_type_display_name,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    geom: `POINT(${place.geometry.location.lng} ${place.geometry.location.lat})`,
    updated_at: new Date().toISOString(),
  }));

  // Upsert POIs
  const { data: upsertedPOIs, error: upsertError } = await supabase
    .from("pois")
    .upsert(poisToUpsert, {
      onConflict: "google_place_id",
      ignoreDuplicates: false,
    });

  if (upsertError) throw upsertError;
  pois = upsertedPOIs || [];

  // Record the fetch history
  const { error: poiFetchHistoryError } = await supabase
    .from("poi_fetch_history")
    .insert({
      lat: lat,
      lng: lng,
      radius: FETCH_RADIUS,
      source: "google_places",
      geom: `POINT(${lng} ${lat})`,
    });

  if (poiFetchHistoryError) throw poiFetchHistoryError;

  return pois;
}

async function getExistingPOIs(lat: number, lng: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("get_pois_in_radius", {
      center_lat: lat,
      center_lng: lng,
      radius_meters: FETCH_RADIUS,
    });

  if (error) throw error;
  return data;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat") || 0;
  const lng = searchParams.get("lng") || 0;
  const shouldFetch = await shouldFetchPOIs(Number(lat), Number(lng));

  if (!shouldFetch) {
    const existingPOIs = await getExistingPOIs(Number(lat), Number(lng));
    return NextResponse.json({ data: existingPOIs });
  }

  const places = await fetchGooglePlaces(Number(lat), Number(lng));
  await savePOIs(places, Number(lat), Number(lng));
  // get them again with another format
  const existingPOIs = await getExistingPOIs(Number(lat), Number(lng));

  return NextResponse.json({ data: existingPOIs });
}
