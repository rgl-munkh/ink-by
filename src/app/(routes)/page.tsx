import { HeroSection } from "@/components/home/HeroSection";
import { TattooGallery } from "@/components/home/TattooGallery";
import { FloatingCTA } from "@/components/home/FloatingCTA";
import { getGalleryItems } from "@/lib/gallery";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await getGalleryItems();
  return (
    <div className="flex min-h-screen flex-col pb-20 max-w-[375px] mx-auto">
      <HeroSection />
      <TattooGallery items={items} />
      {/* <FloatingCTA /> */}
    </div>
  );
}
