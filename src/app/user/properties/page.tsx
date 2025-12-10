import prisma from "@/lib/prisma";
import React from "react";
import PropertiesTable from "./_components/PropertiesTable";
import { getUserById } from "@/lib/actions/user";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";

const PAGE_SIZE = 12;

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

const PropertiesPage = async ({ searchParams }: Props) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { dbUser } = currentUser;
  const role = await getUserRole(dbUser.id);

  const pagenum = searchParams.pagenum ?? 0;
  const propertiesPromise = prisma.property.findMany({
    where: role !== "site-admin" ? { userId: dbUser?.id } : {},

    include: {
      type: true,
      status: true,
      images: true,
    },
    skip: +pagenum * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const totalPropertiesPromise = prisma.property.count({
    where: {
      userId: dbUser.id,
    },
  });

  const [properties, totalProperties] = await Promise.all([
    propertiesPromise,
    totalPropertiesPromise,
  ]);

  const totalPages = Math.floor(totalProperties / PAGE_SIZE);

  console.log({ properties });

  return (
    <PropertiesTable
      properties={properties}
      totalPages={totalPages}
      currentPage={+pagenum}
    />
  );
};
export default PropertiesPage;
