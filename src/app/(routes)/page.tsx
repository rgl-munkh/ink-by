import { HeroSection } from "@/components/home/HeroSection";
import { TattooGallery } from "@/components/home/TattooGallery";
import { FloatingCTA } from "@/components/home/FloatingCTA";
import { getGalleryItems } from "@/lib/gallery";
import { Container } from "@/components/common";
import { ProfileHeader } from "@/components/profile/ProfileHeader";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const items = await getGalleryItems();
  return (
    <Container className="flex min-h-screen flex-col pb-20">
      <ProfileHeader />
      <HeroSection />
      <TattooGallery items={items} />
      {/* <FloatingCTA /> */}
    </Container>
  );
}
