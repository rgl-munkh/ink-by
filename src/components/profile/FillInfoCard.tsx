import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FillInfoCardProps {
  progress: number;
  totalSteps?: number;
}

export function FillInfoCard({
  progress,
  totalSteps = 3,
}: FillInfoCardProps) {
  return (
    <div className="mx-4 mb-6 rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="font-semibold mb-4">Мэдээлэл бөглөх</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Та бидэнд өөрийн мэдээллээ бөглөж өгсөнөөр тантай холбогдоход илүү
        хялбар болно.
      </p>
      <Button
        variant="outline"
        className="w-full justify-between rounded-xl"
        asChild
      >
        <Link href="/profile/edit">
          Мэдээлэл бөглөх
          <ChevronRight className="size-4" />
        </Link>
      </Button>
      <p className="text-muted-foreground text-xs mt-4 text-right">
        {progress}/{totalSteps}
      </p>
    </div>
  );
}
