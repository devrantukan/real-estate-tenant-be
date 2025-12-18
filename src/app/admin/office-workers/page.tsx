import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OfficeWorkerList } from "./_components/OfficeWorkerList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function OfficeWorkersPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  console.log("role is:", role);
  if (role !== "site-admin") {
    redirect("/");
  }
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ofis Çalışanları Yönetimi</h1>
        <Link href="/admin/office-workers/add">
          <Button>Yeni Çalışan Ekle</Button>
        </Link>
      </div>
      <OfficeWorkerList />
    </div>
  );
}
