import React from "react";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrganization } from "@/lib/actions/organization";
import OrganizationForm from "../../_components/OrganizationForm";

interface Props {
  params: { id: string };
}

const EditOrganizationPage = async ({ params }: Props) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { dbUser } = currentUser;
  const role = await getUserRole(dbUser.id);

  // Only site-admin can access
  if (role !== "site-admin") {
    redirect("/unauthorized");
  }

  const organization = await getOrganization(Number(params.id));

  if (!organization) {
    redirect("/admin/organizations");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Organizasyonu Düzenle</h1>
      <OrganizationForm organization={organization} />
    </div>
  );
};

export default EditOrganizationPage;
