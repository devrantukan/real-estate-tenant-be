"use server";

import prisma from "@/lib/prisma";

export async function createSiteAdminRole() {
  try {
    // Site-admin rolünü kontrol et veya oluştur
    let siteAdminRole = await prisma.role.findFirst({
      where: { slug: "site-admin" },
    });

    if (!siteAdminRole) {
      // En yüksek ID'yi bul
      const maxId = await prisma.role.findFirst({
        orderBy: { id: "desc" },
        select: { id: true },
      });

      siteAdminRole = await prisma.role.create({
        data: {
          id: (maxId?.id || 0) + 1,
          title: "Site Admin",
          slug: "site-admin",
        },
      });
    }

    return {
      success: true,
      role: siteAdminRole,
      message: `Site-admin rolü ${siteAdminRole.id} ID ile oluşturuldu/güncellendi.`,
    };
  } catch (error: any) {
    console.error("Error creating site-admin role:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

