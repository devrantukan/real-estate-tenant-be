
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting office seed...');

    // 1. Get or create Organization
    const organization = await prisma.organization.upsert({
        where: { slug: 'default-org' },
        update: {},
        create: {
            name: 'Default Organization',
            slug: 'default-org',
            description: 'Default organization for seeded data',
        },
    });

    const country = await prisma.country.upsert({
        where: { country_id: 1 },
        update: {},
        create: {
            country_id: 1,
            country_name: 'Türkiye',
            slug: 'turkiye',
        },
    });

    // 2. Define Office Data with Location details
    const officesToSeed = [
        {
            name: 'Ankara Çankaya Ofisi',
            slug: 'ankara-cankaya-ofisi',
            city: { id: 6, name: 'Ankara', slug: 'ankara' },
            district: { id: 106, name: 'Çankaya', slug: 'cankaya' },
            neighborhood: { id: 1006, name: 'Kavaklıdere', slug: 'kavaklidere' },
            email: 'cankaya@emlak.com',
            phone: '0312 444 06 06',
            address: 'Tunalı Hilmi Cad. No:45',
            lat: 39.9033,
            lng: 32.8597
        },
        {
            name: 'İzmir Konak Ofisi',
            slug: 'izmir-konak-ofisi',
            city: { id: 35, name: 'İzmir', slug: 'izmir' },
            district: { id: 135, name: 'Konak', slug: 'konak' },
            neighborhood: { id: 1035, name: 'Alsancak', slug: 'alsancak' },
            email: 'konak@emlak.com',
            phone: '0232 444 35 35',
            address: 'Kıbrıs Şehitleri Cad. No:12',
            lat: 38.4333,
            lng: 27.1433
        },
        {
            name: 'Bursa Nilüfer Ofisi',
            slug: 'bursa-nilufer-ofisi',
            city: { id: 16, name: 'Bursa', slug: 'bursa' },
            district: { id: 116, name: 'Nilüfer', slug: 'nilufer' },
            neighborhood: { id: 1116, name: 'Özlüce', slug: 'ozluce' },
            email: 'nilufer@emlak.com',
            phone: '0224 444 16 16',
            address: 'Ahmet Taner Kışlalı Blv. No:88',
            lat: 40.2217,
            lng: 28.9017
        }
    ];

    for (const data of officesToSeed) {
        // Ensure City exists
        const city = await prisma.city.upsert({
            where: { city_id: data.city.id },
            update: {},
            create: {
                city_id: data.city.id,
                city_name: data.city.name,
                slug: data.city.slug,
                country_id: country.country_id,
                country_name: country.country_name,
            },
        });

        // Ensure District exists
        const district = await prisma.district.upsert({
            where: { district_id: data.district.id },
            update: {},
            create: {
                district_id: data.district.id,
                district_name: data.district.name,
                city_id: city.city_id,
                city_name: city.city_name,
                slug: data.district.slug,
            },
        });

        // Ensure Neighborhood exists
        const neighborhood = await prisma.neighborhood.upsert({
            where: { neighborhood_id: data.neighborhood.id },
            update: {},
            create: {
                neighborhood_id: data.neighborhood.id,
                neighborhood_name: data.neighborhood.name,
                city_id: city.city_id,
                city_name: city.city_name,
                district_id: district.district_id,
                district_name: district.district_name,
                slug: data.neighborhood.slug,
            },
        });

        // Create the Office
        const existingOffice = await prisma.office.findFirst({
            where: {
                OR: [
                    { slug: data.slug },
                    { name: data.name }
                ]
            }
        });

        if (existingOffice) {
            console.log(`ℹ️ Office already exists (slug or name): ${data.name}`);
            continue;
        }

        try {
            const office = await prisma.office.create({
                data: {
                    name: data.name,
                    description: `${data.city.name} ${data.district.name} bölgesindeki yetkili ofisimiz.`,
                    email: data.email,
                    phone: data.phone,
                    fax: data.phone,
                    streetAddress: data.address,
                    zip: '00000',
                    latitude: data.lat,
                    longitude: data.lng,
                    cityId: city.city_id,
                    countryId: country.country_id,
                    districtId: district.district_id,
                    neighborhoodId: neighborhood.neighborhood_id,
                    organizationId: organization.id,
                    slug: data.slug,
                    webUrl: `https://${data.slug}.emlak.com`,
                    xAccountId: '',
                    facebookAccountId: '',
                    linkedInAccountId: '',
                    instagramAccountId: '',
                    youtubeAccountId: '',
                },
            });
            console.log(`✅ Office seeded: ${office.name}`);
        } catch (err: any) {
            console.error(`❌ Failed to seed office ${data.name}:`, err.message);
            if (err.code === 'P2002') {
                console.error(`Target fields: ${err.meta?.target}`);
            }
        }
    }

    console.log('✨ Office seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
