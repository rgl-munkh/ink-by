import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t max-w-[375px] mx-auto">
      <Button asChild className="w-full rounded-xl py-6 text-base" size="lg">
        <Link href="#gallery" className="flex items-center justify-center gap-2">
          Үнийн санал, Цаг авах
          <ChevronRight className="size-5" />
        </Link>
      </Button>
    </div>
  );
}
