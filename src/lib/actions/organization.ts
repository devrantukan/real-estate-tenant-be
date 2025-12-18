"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrganizationFormType } from "../validations/organization";

export async function saveOrganization(data: OrganizationFormType) {
  try {
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug || "",
        description: data.description || "",
      },
    });

    revalidatePath("/admin/organizations");
    return organization;
  } catch (error) {
    console.error("Error creating organization:", error);
    throw error;
  }
}

export async function updateOrganization(
  id: number,
  data: OrganizationFormType
) {
  try {
    const organization = await prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug || "",
        description: data.description || "",
      },
    });

    revalidatePath("/admin/organizations");
    return organization;
  } catch (error) {
    console.error("Error updating organization:", error);
    throw error;
  }
}

export async function deleteOrganization(id: number) {
  try {
    await prisma.organization.delete({
      where: { id },
    });

    revalidatePath("/admin/organizations");
    return { success: true };
  } catch (error) {
    console.error("Error deleting organization:", error);
    throw new Error("Failed to delete organization");
  }
}

export async function getOrganizationById(id: number) {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
    });
    return organization;
  } catch (error) {
    console.error("Error fetching organization:", error);
    throw error;
  }
}

export async function getAllOrganizations() {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return organizations;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
}

