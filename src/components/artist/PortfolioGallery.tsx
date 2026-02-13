import { format } from "date-fns";
import Image from "next/image";
export interface PortfolioItem {
  id: number;
  imageUrl: string;
  createdAt: Date;
}

export interface PortfolioGalleryProps {
  items: PortfolioItem[];
}

export function PortfolioGallery({ items }: PortfolioGalleryProps) {
  if (items.length === 0) return null;

  return (
    <section className="px-4 pb-8">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden">
            <div className="aspect-square bg-muted">
              <Image
                src={item.imageUrl}
                alt={item.imageUrl}
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium">
                {format(item.createdAt, "yyyy.M.d")}
              </p>
              <p className="text-xs text-muted-foreground">Date</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
