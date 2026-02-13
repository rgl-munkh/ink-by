import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";

export const dynamic = "force-dynamic";

export default async function ProfileEditPage() {
  const authUser = await getCurrentUser();
  if (!authUser) {
    redirect("/login");
  }

  const [dbUser] = await db
    .select({ name: users.name, email: users.email, phone: users.phone })
    .from(users)
    .where(eq(users.id, authUser.id));

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 py-8">
      <Link href="/profile" className="text-primary text-sm underline mb-6 block">
        Буцах
      </Link>
      <h1 className="text-xl font-bold mb-6">Мэдээлэл бөглөх</h1>
      <ProfileEditForm
        userId={authUser.id}
        initialName={dbUser?.name ?? ""}
        initialEmail={dbUser?.email ?? ""}
        initialPhone={dbUser?.phone ?? ""}
      />
    </div>
  );
}
