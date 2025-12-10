/**
 * Bu script kullanıcıyı admin yapar
 * Kullanım: npx tsx scripts/make-user-admin.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(__dirname, "../.env") });

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is required. " +
    "Please ensure it's set in your .env file."
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: ["query", "error", "warn"],
});

const USER_ID = "e555c443-4da6-4a36-bb2a-db592280e62d";

async function makeUserAdmin() {
  try {
    console.log("Admin atama işlemi başlatılıyor...");

    // 1. Kullanıcıyı kontrol et
    const user = await prisma.user.findUnique({
      where: { id: USER_ID },
    });

    if (!user) {
      throw new Error(`Kullanıcı bulunamadı: ${USER_ID}`);
    }

    console.log(`Kullanıcı bulundu: ${user.email}`);

    // 2. Organization'ı bul veya oluştur
    let organization = await prisma.organization.findUnique({
      where: { slug: "default" },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: "Default Organization",
          slug: "default",
          description: "Default organization for admin users",
        },
      });
      console.log("Yeni organization oluşturuldu:", organization.slug);
    } else {
      console.log("Organization bulundu:", organization.slug);
    }

    // 3. site-admin role'ünü bul veya oluştur
    let adminRole = await prisma.role.findFirst({
      where: {
        slug: "site-admin",
        organizationId: organization.id,
      },
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          title: "Site Admin",
          slug: "site-admin",
          organizationId: organization.id,
        },
      });
      console.log("Yeni admin role oluşturuldu:", adminRole.slug);
    } else {
      console.log("Admin role bulundu:", adminRole.slug);
    }

    // 4. Kullanıcıyı organization'a bağla
    if (user.organizationId !== organization.id) {
      await prisma.user.update({
        where: { id: USER_ID },
        data: { organizationId: organization.id },
      });
      console.log("Kullanıcı organization'a bağlandı");
    }

    // 5. Office'i bul veya oluştur (OfficeWorker için gerekli)
    let office = await prisma.office.findFirst({
      where: {
        organizationId: organization.id,
      },
    });

    // Eğer organization'da office yoksa, herhangi bir office'i kullan
    if (!office) {
      office = await prisma.office.findFirst();
    }

    // Eğer hiç office yoksa, minimal bir office oluştur
    if (!office) {
      console.log("Office bulunamadı, minimal bir Office oluşturuluyor...");

      // Önce Country'yi bul veya oluştur
      let country = await prisma.country.findFirst({
        where: { slug: "turkey" },
      });

      if (!country) {
        country = await prisma.country.create({
          data: {
            country_name: "Turkey",
            slug: "turkey",
          },
        });
        console.log("Country oluşturuldu:", country.country_name);
      }

      // City'yi bul veya oluştur
      let city = await prisma.city.findFirst({
        where: { slug: "istanbul" },
      });

      if (!city) {
        city = await prisma.city.create({
          data: {
            city_name: "Istanbul",
            slug: "istanbul",
            country_id: country.country_id,
            country_name: country.country_name,
          },
        });
        console.log("City oluşturuldu:", city.city_name);
      }

      // District'i bul veya oluştur
      let district = await prisma.district.findFirst({
        where: { slug: "kadikoy" },
      });

      if (!district) {
        district = await prisma.district.create({
          data: {
            district_name: "Kadikoy",
            slug: "kadikoy",
            city_id: city.city_id,
            city_name: city.city_name,
          },
        });
        console.log("District oluşturuldu:", district.district_name);
      }

      // Neighborhood'ı bul veya oluştur
      let neighborhood = await prisma.neighborhood.findFirst({
        where: { slug: "moda" },
      });

      if (!neighborhood) {
        neighborhood = await prisma.neighborhood.create({
          data: {
            neighborhood_name: "Moda",
            slug: "moda",
            city_id: city.city_id,
            city_name: city.city_name,
            district_id: district.district_id,
            district_name: district.district_name,
          },
        });
        console.log("Neighborhood oluşturuldu:", neighborhood.neighborhood_name);
      }

      // Office'i oluştur
      office = await prisma.office.create({
        data: {
          name: "Default Office",
          latitude: 41.0082,
          longitude: 28.9784,
          organizationId: organization.id,
          streetAddress: "Default Street",
          cityId: city.city_id,
          zip: "34000",
          countryId: country.country_id,
          districtId: district.district_id,
          neighborhoodId: neighborhood.neighborhood_id,
          description: "Default office for admin users",
          email: user.email,
          phone: "",
          fax: "",
          xAccountId: "",
          facebookAccountId: "",
          linkedInAccountId: "",
          instagramAccountId: "",
          youtubeAccountId: "",
          webUrl: "",
          slug: "default-office",
        },
      });
      console.log("Office oluşturuldu:", office.name);
    } else {
      console.log("Office bulundu:", office.name);
    }

    // 6. OfficeWorker'ı bul veya oluştur
    let officeWorker = await prisma.officeWorker.findUnique({
      where: { userId: USER_ID },
    });

    if (officeWorker) {
      // Mevcut OfficeWorker'ı güncelle
      officeWorker = await prisma.officeWorker.update({
        where: { id: officeWorker.id },
        data: {
          roleId: adminRole.id,
          name: user.firstName,
          surname: user.lastName || "",
          email: user.email,
        },
      });
      console.log("OfficeWorker güncellendi");
    } else {
      // Yeni OfficeWorker oluştur
      const slug = user.email.toLowerCase().replace("@", "-at-");
      officeWorker = await prisma.officeWorker.create({
        data: {
          name: user.firstName,
          surname: user.lastName || "",
          roleId: adminRole.id,
          avatarUrl: user.avatarUrl,
          about: "Admin user",
          email: user.email,
          phone: "",
          xAccountId: "",
          facebookAccountId: "",
          linkedInAccountId: "",
          instagramAccountId: "",
          youtubeAccountId: "",
          webUrl: "",
          commercialDocumentId: "",
          companyLegalName: "",
          officeId: office.id,
          slug: slug,
          userId: USER_ID,
        },
      });
      console.log("Yeni OfficeWorker oluşturuldu");
    }

    // 7. Sonucu kontrol et
    const result = await prisma.user.findUnique({
      where: { id: USER_ID },
      include: {
        organization: true,
        officeWorker: {
          include: {
            role: true,
          },
        },
      },
    });

    console.log("\n✅ İşlem tamamlandı!");
    console.log("\nKullanıcı Bilgileri:");
    console.log(`  ID: ${result?.id}`);
    console.log(`  Email: ${result?.email}`);
    console.log(`  Ad: ${result?.firstName} ${result?.lastName}`);
    console.log(`  Organization: ${result?.organization?.name}`);
    console.log(`  Role: ${result?.officeWorker?.role?.title} (${result?.officeWorker?.role?.slug})`);
  } catch (error) {
    console.error("❌ Hata:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

makeUserAdmin()
  .then(() => {
    console.log("\nScript başarıyla tamamlandı.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nScript hatası:", error);
    process.exit(1);
  });
