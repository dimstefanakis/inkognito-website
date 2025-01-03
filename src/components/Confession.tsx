import { Button } from "@/components/ui/button"
import Image from "next/image"

interface Confession {
  id: string;
  text: string;
  gender: 'male' | 'female' | 'other';
  latitude: number;
  longitude: number;
}

interface ConfessionProps {
  confession: Confession;
  distance: number;
  nearbyCount: number;
  onSeeMore: () => void;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function ConfessionDisplay({ confession, distance, nearbyCount, onSeeMore }: ConfessionProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <Image
        src="/icon.png"
        alt="Inkognito logo"
        width={128}
        height={128}
        className="rounded-full mb-8"
      />
      <p className="text-2xl mb-6 leading-relaxed break-words">"{confession.text}"</p>
      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-10">
        <span>- {confession.gender === 'male' ? 'Male' : confession.gender === 'female' ? 'Female' : 'Other'}</span>
        <span>•</span>
        <span>{formatDistance(distance * 1000)} away</span>
      </div>
      <div className="w-full max-w-xs">
        <Button 
          onClick={onSeeMore} 
          className="w-full font-bold h-16 text-lg"
        >
          See {nearbyCount} more {nearbyCount === 1 ? 'secret' : 'secrets'} nearby
        </Button>
      </div>
    </div>
  );
}
