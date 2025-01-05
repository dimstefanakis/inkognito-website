import Link from "next/link";
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Tables } from "../../types_db";

interface ConfessionProps {
  confession: Tables<"posts_public">;
  distance: number;
  nearbyCount: number;
  onSeeMore: () => void;
  link: string;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

function getRelativeTimeShort(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`;
  return `${Math.floor(diffInSeconds / 31536000)}y`;
}

export function ConfessionDisplay({ confession, distance, nearbyCount, onSeeMore, link }: ConfessionProps) {
  function getNearbyCountText() {
    if (nearbyCount > 1000) {
      return '1000+';
    }
    return `${nearbyCount}`;
  }

  function getConfessionText() {
    if (confession.content && confession.content.length > 150) {
      return `${confession.content.slice(0, 150)}...`;
    }
    return confession.content;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Image
        src="/icon.png"
        alt="Inkognito logo"
        width={128}
        height={128}
        className="rounded-full mb-8"
      />
      <p className="text-2xl mb-6 break-words">
        &ldquo;{getConfessionText()}&rdquo;
      </p>
      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-10">
        <span>- {confession.gender === 'male' ? 'Male' : confession.gender === 'female' ? 'Female' : 'Other'}</span>
        <span>•</span>
        <span>{formatDistance(distance * 1000)} away</span>
        <span>•</span>
        <span>{getRelativeTimeShort(confession.created_at as string)}</span>
      </div>
      <div className="w-full max-w-xs">
        <Link href={link || ''}>
          <Button
            onClick={onSeeMore}
            className="w-full font-bold h-16 text-[16px]"
          >
            See {getNearbyCountText()} more secrets near you
          </Button>
        </Link>
      </div>
    </div>
  );
}
