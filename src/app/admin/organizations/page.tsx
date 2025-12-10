import React from "react";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrganizations } from "@/lib/actions/organization";
import OrganizationsTable from "./_components/OrganizationsTable";

const PAGE_SIZE = 10;

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const OrganizationsPage = async ({ searchParams }: Props) => {
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

  const pagenum = searchParams.pagenum ? Number(searchParams.pagenum) - 1 : 0;
  const { organizations, total } = await getOrganizations(pagenum, PAGE_SIZE);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Organizasyonlar</h1>
        <a
          href="/admin/organizations/add"
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Yeni Organizasyon Ekle
        </a>
      </div>
      <OrganizationsTable
        organizations={organizations}
        totalPages={totalPages}
        currentPage={pagenum + 1}
      />
    </div>
  );
};

export default OrganizationsPage;
