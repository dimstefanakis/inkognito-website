export type CoarseLocationKind =
  | "locality"
  | "place"
  | "district"
  | "region"
  | "country";

export type CoarseLocation = {
  name: string;
  kind: CoarseLocationKind;
};

type ContextItem = {
  name?: string;
  region_code?: string;
  country_code?: string;
};

type MapboxResponse = {
  features?: Array<{
    properties?: {
      feature_type?: string;
      name?: string;
      name_preferred?: string;
      context?: Partial<Record<CoarseLocationKind, ContextItem>>;
    };
  }>;
};

const LOCATION_KINDS: CoarseLocationKind[] = [
  "locality",
  "place",
  "district",
  "region",
  "country",
];

function cleanName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return cleaned || null;
}

export function parseMapboxCoarseLocation(
  payload: MapboxResponse,
): CoarseLocation | null {
  const candidates = new Map<CoarseLocationKind, ContextItem>();

  for (const feature of payload.features ?? []) {
    const properties = feature.properties;
    const featureType = properties?.feature_type as CoarseLocationKind | undefined;
    if (featureType && LOCATION_KINDS.includes(featureType)) {
      candidates.set(featureType, {
        name: properties?.name_preferred ?? properties?.name,
        region_code: properties?.context?.region?.region_code,
        country_code: properties?.context?.country?.country_code,
      });
    }
    for (const kind of LOCATION_KINDS) {
      const context = properties?.context?.[kind];
      if (context?.name && !candidates.has(kind)) candidates.set(kind, context);
    }
  }

  const countryCode = (
    candidates.get("country")?.country_code ??
    [...candidates.values()].find((item) => item.country_code)?.country_code ??
    ""
  ).toUpperCase();
  const regionCode = (
    candidates.get("region")?.region_code ??
    [...candidates.values()].find((item) => item.region_code)?.region_code ??
    ""
  )
    .split("-")
    .at(-1)
    ?.toUpperCase();

  for (const kind of LOCATION_KINDS) {
    const name = cleanName(candidates.get(kind)?.name);
    if (!name) continue;
    if (
      (kind === "place" || kind === "district") &&
      countryCode === "US" &&
      regionCode
    ) {
      const suffix = `, ${regionCode}`;
      return {
        name: name.toUpperCase().endsWith(suffix) ? name : `${name}${suffix}`
          .slice(0, 120),
        kind,
      };
    }
    return { name, kind };
  }
  return null;
}

export async function reverseGeocodeCoarseLocation({
  lat,
  lng,
  accessToken,
  timeoutMs = 1500,
}: {
  lat: number;
  lng: number;
  accessToken: string;
  timeoutMs?: number;
}): Promise<CoarseLocation | null> {
  const params = new URLSearchParams({
    longitude: String(lng),
    latitude: String(lat),
    types: LOCATION_KINDS.join(","),
    language: "en",
    permanent: "false",
    access_token: accessToken,
  });
  if (params.get("permanent") !== "false") {
    throw new Error("Permanent geocoding is disabled");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/reverse?${params.toString()}`,
      { signal: controller.signal },
    );
    if (!response.ok) {
      throw new Error(`Mapbox reverse geocoding failed (${response.status})`);
    }
    return parseMapboxCoarseLocation(
      (await response.json()) as MapboxResponse,
    );
  } finally {
    clearTimeout(timeout);
  }
}
