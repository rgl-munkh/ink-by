import Link from "next/link";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="w-full mx-auto px-6 pt-8 pb-6">
      <div className="mb-6 w-48 h-40 flex items-center justify-center">
        <Image src="/assets/home-icon.png" alt="Hero illustration" width={160} height={120} />
      </div>

      <h1 className="text-xl sm:text-2xl font-semibold text-center mb-6 max-w-md">
        Шивээс хийлгэх &apos;Артист&apos;-аа сонгоорой
      </h1>

      <div className="flex gap-3 w-full max-w-sm">
        <Button asChild className="flex-1 rounded-xl" size="lg">
          <Link href="/login">Нэвтрэх</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1 rounded-xl" size="lg">
          <Link href="/sign-up" className="flex items-center gap-2">
            Бүртгүүлэх
          </Link>
        </Button>
      </div>
    </section>
  );
}
