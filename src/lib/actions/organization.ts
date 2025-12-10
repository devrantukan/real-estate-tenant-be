"use server";

import prisma from "../prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface OrganizationFormData {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
}

export async function createOrganization(data: OrganizationFormData) {
  try {
    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
      },
    });
    revalidatePath("/admin/organizations");
    return { success: true, organization };
  } catch (error: any) {
    console.error("Error creating organization:", error);
    return { success: false, error: error.message };
  }
}

export async function updateOrganization(
  id: number,
  data: OrganizationFormData
) {
  try {
    const organization = await prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
      },
    });
    revalidatePath("/admin/organizations");
    return { success: true, organization };
  } catch (error: any) {
    console.error("Error updating organization:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteOrganization(id: number) {
  try {
    await prisma.organization.delete({
      where: { id },
    });
    revalidatePath("/admin/organizations");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting organization:", error);
    return { success: false, error: error.message };
  }
}

export async function getOrganization(id: number) {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id },
    });
    return organization;
  } catch (error: any) {
    console.error("Error fetching organization:", error);
    return null;
  }
}

export async function getOrganizations(page: number = 0, pageSize: number = 10) {
  try {
    const [organizations, total] = await Promise.all([
      prisma.organization.findMany({
        skip: page * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.organization.count(),
    ]);
    return { organizations, total };
  } catch (error: any) {
    console.error("Error fetching organizations:", error);
    return { organizations: [], total: 0 };
  }
}
