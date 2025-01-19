import { createClient } from "./supabase/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY!;

// Optional: Get a free API key from https://wiki.openstreetmap.org/wiki/Mapillary
const MAPILLARY_API_KEY = process.env.MAPILLARY_API_KEY;

interface ImageSource {
  url: string;
  source: 'google' | 'foursquare' | 'mapillary' | 'osm' | 'wikipedia';
  attribution?: string;
}

async function getGooglePlacePhotos(placeId: string): Promise<ImageSource[]> {
  try {
    // First, get place details
    const detailsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`
    );
    const details = await detailsResponse.json();

    if (!details.result?.photos) return [];

    // Get photo URLs for up to 3 photos
    return details.result.photos.slice(0, 3).map((photo: any) => ({
      url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`,
      source: 'google',
      attribution: photo.html_attributions[0]
    }));
  } catch (error) {
    console.error('Error fetching Google photos:', error);
    return [];
  }
}

async function getFoursquareVenuePhotos(venueId: string): Promise<ImageSource[]> {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/${venueId}/photos`,
      {
        headers: {
          'Authorization': FOURSQUARE_API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    const photos = await response.json();

    return photos.slice(0, 3).map((photo: any) => ({
      url: `${photo.prefix}400x400${photo.suffix}`,
      source: 'foursquare',
      attribution: 'Powered by Foursquare'
    }));
  } catch (error) {
    console.error('Error fetching Foursquare photos:', error);
    return [];
  }
}

async function getWikipediaImage(osmTags: any): Promise<ImageSource[]> {
  if (!osmTags.wikipedia) return [];

  try {
    const [lang, title] = osmTags.wikipedia.split(':');
    const response = await fetch(
      `https://api.wikimedia.org/core/v1/wikipedia/${lang}/page/${encodeURIComponent(title)}/thumbnail`
    );
    const data = await response.json();

    return [{
      url: data.thumbnail.url,
      source: 'wikipedia',
      attribution: 'Wikipedia'
    }];
  } catch (error) {
    console.error('Error fetching Wikipedia image:', error);
    return [];
  }
}

async function getMapillaryImages(lat: number, lon: number): Promise<ImageSource[]> {
  if (!MAPILLARY_API_KEY) return [];

  try {
    const response = await fetch(
      `https://graph.mapillary.com/images?access_token=${MAPILLARY_API_KEY}&fields=id,thumb_1024_url&limit=3&radius=50&latitude=${lat}&longitude=${lon}`
    );
    const data = await response.json();

    return data.data.map((image: any) => ({
      url: image.thumb_1024_url,
      source: 'mapillary',
      attribution: 'Mapillary'
    }));
  } catch (error) {
    console.error('Error fetching Mapillary images:', error);
    return [];
  }
}

// Update the POI import function
async function updatePOIWithImages(
  poiId: string,
  osmTags: any,
  lat: number,
  lon: number
): Promise<void> {
  const supabase = await createClient()
  let images: ImageSource[] = [];
  let logoUrl: string | null = null;

  // Try to get a Google Place ID first
  const placeResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(osmTags.name)}&inputtype=textquery&locationbias=point:${lat},${lon}&key=${GOOGLE_API_KEY}`
  );
  const placeData = await placeResponse.json();
  const googlePlaceId = placeData.candidates?.[0]?.place_id;

  if (googlePlaceId) {
    const googlePhotos = await getGooglePlacePhotos(googlePlaceId);
    images = [...images, ...googlePhotos];

    // Use first Google photo as logo if available
    if (googlePhotos.length > 0) {
      logoUrl = googlePhotos[0].url;
    }
  }

  // Get Wikipedia image if available
  const wikiImages = await getWikipediaImage(osmTags);
  images = [...images, ...wikiImages];

  // If no logo yet, try Wikipedia image
  if (!logoUrl && wikiImages.length > 0) {
    logoUrl = wikiImages[0].url;
  }

  // Get Mapillary street view images
  const mapillaryImages = await getMapillaryImages(lat, lon);
  images = [...images, ...mapillaryImages];

  // Update the POI in the database
  await supabase
    .from('pois')
    .update({
      images: images,
      logo_url: logoUrl,
      google_place_id: googlePlaceId
    })
    .eq('id', poiId);
}