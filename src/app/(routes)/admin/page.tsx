import Link from "next/link";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/" className="text-primary text-sm underline">
          Back
        </Link>
      </div>
      <AdminDashboard />
    </div>
  );
}
