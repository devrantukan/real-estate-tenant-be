import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllOrganizations } from "@/lib/actions/organization";
import OrganizationsTable from "./_components/OrganizationsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function OrganizationsPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  if (role !== "site-admin") {
    redirect("/");
  }

  const organizations = await getAllOrganizations();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizasyonlar</h1>
        <Link href="/admin/organizations/add">
          <Button>Yeni Organizasyon Ekle</Button>
        </Link>
      </div>
      <OrganizationsTable organizations={organizations as any} />
    </div>
  );
}

