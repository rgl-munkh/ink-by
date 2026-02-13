import { ARTIST_OVERVIEW_LABELS } from "@/lib/booking-labels";

export interface ArtistRequestOverviewProps {
  newCount: number;
  pendingLongCount: number;
}

export function ArtistRequestOverview({
  newCount,
  pendingLongCount,
}: ArtistRequestOverviewProps) {
  return (
    <div className="flex gap-3 px-4">
      <div className="flex-1 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">+{newCount} user</p>
            <p className="text-sm text-muted-foreground">
              {ARTIST_OVERVIEW_LABELS.newRequest}
            </p>
          </div>
          <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl">
            🙂
          </div>
        </div>
      </div>
      <div className="flex-1 rounded-xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">
              {pendingLongCount} user (+4цаг)
            </p>
            <p className="text-sm text-muted-foreground">
              {ARTIST_OVERVIEW_LABELS.pendingLong}
            </p>
          </div>
          <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl">
            😕
          </div>
        </div>
      </div>
    </div>
  );
}
