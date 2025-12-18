import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrganizationForm from "../_components/OrganizationForm";

export default async function AddOrganizationPage() {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  if (role !== "site-admin") {
    redirect("/");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Yeni Organizasyon Ekle</h1>
      <OrganizationForm mode="add" />
    </div>
  );
}

