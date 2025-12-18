import { getUser } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrganizationById } from "@/lib/actions/organization";
import OrganizationForm from "../../_components/OrganizationForm";

export default async function EditOrganizationPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  if (!user) {
    redirect("/");
  }

  const role = await getUserRole(user.id);
  if (role !== "site-admin") {
    redirect("/");
  }

  const organization = await getOrganizationById(Number(params.id));

  if (!organization) {
    redirect("/admin/organizations");
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Organizasyon Düzenle</h1>
      <OrganizationForm mode="edit" organization={organization} />
    </div>
  );
}

