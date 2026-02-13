'use client'

import type { GalleryItem } from "@/lib/gallery";
import { GalleryCard } from "./GalleryCard";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface TattooGalleryProps {
  items: GalleryItem[];
}

const LeftColumn = ({ item, index }: { item: GalleryItem, index: number }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/artist/${item.artistId}`);
  }
  return (
    <div style={{ width: "165.5px" }} className="m-2 cursor-pointer" onClick={handleClick}>
      <Image src={item.imageUrl} alt={item.artistName} width={165.5} height={221.15} className="rounded-lg h-[221.15px] w-full object-cover" />

      <div className="flex justify-between items-center gap-2 mt-2">
        <div className="flex gap-2 items-center">
          <Avatar className="size-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="leading-none">
            <div className="font-medium">
              {item.instagramUsername}
            </div>
            <div className="text-gray-500 text-sm">
              Instagram
            </div>
          </div>
        </div>

        <div>
          <ChevronRightIcon size={20} color="#000" />
        </div>
      </div>
    </div>
  )
}


const RightColumn = ({ item, index }: { item: GalleryItem, index: number }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/artist/${item.artistId}`);
  }
  return (
    <div style={{ width: "165.5px" }} className="m-2 cursor-pointer" onClick={handleClick}>
      <Image src={item.imageUrl} alt={item.artistName} width={165.5} height={165.5} className="rounded-lg h-[165.5px] w-full object-cover" />

      <div className="flex justify-between items-center gap-2 mt-2">
        <div className="flex gap-2 items-center">
          <Avatar className="size-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="leading-none">
            <div className="font-medium">
              {item.instagramUsername}
            </div>
            <div className="text-gray-500 text-sm">
              Instagram
            </div>
          </div>
        </div>

        <div>
          <ChevronRightIcon size={20} color="#000" />
        </div>
      </div>
    </div>
  )
}

export function TattooGallery({ items }: TattooGalleryProps) {

  const leftColumnItems = items.slice(0, items.length % 2 === 0 ? items.length / 2 : (items.length / 2) + 1);
  const rightColumnItems = items.slice(items.length % 2 === 0 ? items.length / 2 : (items.length / 2) + 1);
  return (
    <section id="gallery" className="w-full mx-auto pb-24 flex gap-1">

      <div>
        {
          leftColumnItems.map((item, index) => {
            const isOdd = index % 2 === 0;
            if (isOdd) {
              return <LeftColumn key={item.portfolioId} item={item} index={index} />
            } else {
              return <RightColumn key={item.portfolioId} item={item} index={index} />
            }
          })
        }
      </div>

      <div>
        {
          rightColumnItems.map((item, index) => {
            const isOdd = index % 2 === 0;
            if (isOdd) {
              return <RightColumn key={item.portfolioId} item={item} index={index} />
            } else {
              return <LeftColumn key={item.portfolioId} item={item} index={index} />
            }
          })
        }
      </div>
    </section>
  );
}
