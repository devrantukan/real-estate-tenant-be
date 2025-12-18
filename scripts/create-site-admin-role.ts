import prisma from "@/lib/prisma";

async function createSiteAdminRole() {
  try {
    // Site-admin rolünü kontrol et veya oluştur
    let siteAdminRole = await prisma.role.findFirst({
      where: { slug: "site-admin" },
    });

    if (!siteAdminRole) {
      siteAdminRole = await prisma.role.create({
        data: {
          title: "Site Admin",
          slug: "site-admin",
        },
      });
      console.log("✅ Site-admin rolü oluşturuldu. ID:", siteAdminRole.id);
    } else {
      console.log("ℹ️  Site-admin rolü zaten mevcut. ID:", siteAdminRole.id);
    }

    return siteAdminRole;
  } catch (error) {
    console.error("❌ Hata:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createSiteAdminRole();

