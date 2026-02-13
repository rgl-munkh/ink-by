import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { FillInfoCard } from "@/components/profile/FillInfoCard";
import { YourRequestsSection } from "@/components/profile/YourRequestsSection";

export const dynamic = "force-dynamic";

function getProfileProgress(user: { name: string; email: string; phone: string | null }): number {
  let progress = 0;
  if (user.name?.trim()) progress++;
  if (user.email?.trim()) progress++;
  if (user.phone?.trim()) progress++;
  return Math.max(1, Math.min(progress, 3));
}

export default async function ProfilePage() {
  const authUser = await getCurrentUser();
  if (!authUser) {
    redirect("/login");
  }

  const [dbUser] = await db
    .select({ name: users.name, email: users.email, phone: users.phone })
    .from(users)
    .where(eq(users.id, authUser.id));

  const progress = dbUser ? getProfileProgress(dbUser) : 1;

  return (
    <div className="min-h-screen max-w-lg mx-auto pb-12">
      <ProfileHeader />
      <FillInfoCard progress={progress} />
      <YourRequestsSection />
    </div>
  );
}
