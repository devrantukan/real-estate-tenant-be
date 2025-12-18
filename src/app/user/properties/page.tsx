import prisma from "@/lib/prisma";
import { getUser } from "@/lib/supabase/server";
import React from "react";
import PropertiesTable from "./_components/PropertiesTable";
import { getUserById } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { getUserRole } from "@/lib/auth";
const PAGE_SIZE = 12;

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PropertiesPage = async ({ searchParams }: Props) => {
  const user = await getUser();
  console.log("user is:", user);
  if (!user) {
    redirect("/login");
  }

  const role = await getUserRole(user.id);

  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    redirect("/login");
  }

  const params = await searchParams;
  const search = (params.search as string) || "";
  const pagenum = +(params.pagenum ?? 1) - 1;
  const sort = (params.sort as string) || "id";
  const direction = (params.direction as "asc" | "desc") || "desc";

  // Check if search term is a number
  const searchNumber = parseInt(search);
  const isNumericSearch = !isNaN(searchNumber);

  // Build where clause for search and user role
  const where: Prisma.PropertyWhereInput = {
    ...(role !== "site-admin" ? { userId: dbUser.id } : {}),
    ...(search
      ? isNumericSearch
        ? { id: searchNumber } // For numeric searches, only search by ID
        : {
            OR: [
              {
                name: { contains: search, mode: Prisma.QueryMode.insensitive },
              },
              {
                agent: {
                  OR: [
                    {
                      name: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                    {
                      surname: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                  ],
                },
              },
            ],
          }
      : {}),
  };

  // Get total count with search filter
  const totalPropertiesPromise = await prisma.property.count({ where });

  // Build orderBy clause based on sort field
  const orderBy: Prisma.PropertyOrderByWithRelationInput = {};

  // Handle nested fields for sorting
  if (sort === "type") {
    orderBy.type = { value: direction };
  } else if (sort === "status") {
    orderBy.status = { value: direction };
  } else if (sort === "agent") {
    orderBy.agent = { name: direction };
  } else {
    // Handle direct property fields
    orderBy[sort as keyof Prisma.PropertyOrderByWithRelationInput] = direction;
  }

  const propertiesPromise = await prisma.property.findMany({
    where,
    include: {
      type: true,
      status: true,
      images: true,
      agent: true,
    },
    skip: Math.max(0, pagenum * PAGE_SIZE),
    take: PAGE_SIZE,
    orderBy,
  });

  const [properties, totalProperties] = await Promise.all([
    propertiesPromise,
    totalPropertiesPromise,
  ]);

  const totalPages = Math.max(1, Math.ceil(totalProperties / PAGE_SIZE));

  return (
    <PropertiesTable
      properties={properties}
      totalPages={totalPages}
      currentPage={+pagenum + 1}
      totalCount={totalProperties}
      searchTerm={search}
    />
  );
};
export default PropertiesPage;
