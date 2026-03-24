import Link from "next/link";
import { User, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileHeader() {
  return (
    <header className="flex items-center justify-between w-full px-4 py-4">
      <h1 className="text-xl font-bold">
        Өдрийн мэнд!
        <span className="ml-1">👋</span>
      </h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="rounded-full" asChild>
          <Link href="/profile">
            <User className="size-5" />
          </Link>
        </Button>
        <Button variant="outline" size="icon" className="rounded-full" asChild>
          <Link href="/">
            <Flower2 className="size-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
