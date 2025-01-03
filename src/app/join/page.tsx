"use client";

import { useState, useEffect } from "react";
import { LocationPrompt } from "@/components/LocationPrompt";
import { ConfessionDisplay } from "@/components/Confession";
import { getLocation, calculateDistance } from "@/utils/geolocation";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  content: string;
  lat: number;
  lng: number;
  gender: "male" | "female" | "other";
}

export default function JoinPage() {
  const [locationEnabled, setLocationEnabled] = useState<boolean | null>(null);
  const [userLocation, setUserLocation] =
    useState<GeolocationCoordinates | null>(null);
  const [confession, setConfession] = useState<Post | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [nearbyCount, setNearbyCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locationEnabled && userLocation) {
      setIsLoading(true);
      Promise.all([
        fetch("/api/preview-posts"),
        fetch(
          `/api/post-count?lat=${userLocation.latitude}&lng=${userLocation.longitude}`
        ),
      ])
        .then(([postsRes, countRes]) =>
          Promise.all([postsRes.json(), countRes.json()])
        )
        .then(([postsData, countData]) => {
          if (postsData.posts && postsData.posts.length > 0) {
            const longestPost = postsData.posts.reduce(
              (longest: Post, current: Post) =>
                current.content.length > longest.content.length
                  ? current
                  : longest,
              postsData.posts[0]
            );

            setConfession({
              id: longestPost.id,
              content:
                longestPost.content.length > 100
                  ? longestPost.content.slice(0, 100) + "..."
                  : longestPost.content,
              lat: longestPost.lat,
              lng: longestPost.lng,
              gender: longestPost.gender,
            });

            const dist = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              longestPost.lat,
              longestPost.lng
            );
            setDistance(dist);
          }

          if (countData.count) {
            setNearbyCount(Math.max(0, countData.count - 1));
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [locationEnabled, userLocation]);

  const handleAllowLocation = async () => {
    try {
      const position = await getLocation();
      setUserLocation(position.coords);
      setLocationEnabled(true);
    } catch (error) {
      console.error("Error getting location:", error);
      handleDenyLocation();
    }
  };

  const handleDenyLocation = () => {
    setLocationEnabled(false);
    openAppStore();
  };

  const openAppStore = () => {
    // Simulate opening the App Store
    window.location.href = "https://apps.apple.com/us/app/your-app-id";
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {locationEnabled === null && (
          <LocationPrompt
            onAllow={handleAllowLocation}
            onDeny={handleDenyLocation}
          />
        )}
        {locationEnabled &&
          (isLoading ? (
            <ConfessionSkeleton />
          ) : (
            confession &&
            distance !== null && (
              <ConfessionDisplay
                confession={{
                  id: confession.id,
                  text: confession.content,
                  gender: confession.gender,
                  latitude: confession.lat,
                  longitude: confession.lng,
                }}
                distance={distance}
                nearbyCount={nearbyCount}
                onSeeMore={openAppStore}
              />
            )
          ))}
      </div>
    </div>
  );
}

function ConfessionSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <div className="w-full space-y-2">
        <Skeleton className="h-4 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
      <Skeleton className="h-4 w-24 mx-auto mt-4" />
      <Skeleton className="h-4 w-32 mx-auto" />
      <Skeleton className="h-10 w-full mt-4" />
    </div>
  );
}
