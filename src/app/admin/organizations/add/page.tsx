import React from "react";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrganizationForm from "../_components/OrganizationForm";

const AddOrganizationPage = async () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Yeni Organizasyon Ekle</h1>
      <OrganizationForm />
    </div>
  );
};

export default AddOrganizationPage;
