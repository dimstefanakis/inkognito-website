import { Button } from "@/components/ui/button"
import Image from "next/image";

interface LocationPromptProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPrompt({ onAllow, onDeny }: LocationPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="mb-6 relative w-full max-w-[280px] aspect-video rounded-lg overflow-hidden">
        <Image
          src="/onboarding.png"
          alt="Map showing local confessions"
          fill
          className="object-cover"
          priority
        />
      </div>
      <h1 className="text-3xl font-bold mb-3">See what your neighbors are hiding 👀</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Enable location to see confessions from your area
      </p>
      <div className="space-y-4 w-full max-w-xs">
        <Button
          onClick={onAllow}
          className="w-full font-bold h-16 text-md"
        >
          Enable Location to see confessions
        </Button>
        <Button
          onClick={onDeny}
          variant="ghost"
          className="w-full text-sm"
        >
          Not Now
        </Button>
      </div>
    </div>
  );
}

