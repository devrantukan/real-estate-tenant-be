
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
    console.log('🌱 Starting project seed...');

    // 1. Get or create Organization
    const organization = await prisma.organization.upsert({
        where: { slug: 'default-org' },
        update: {},
        create: {
            name: 'Default Organization',
            slug: 'default-org',
            description: 'Default organization for seeded projects',
        },
    });

    // 2. Setup Location Data (Country, City, District, Neighborhood)
    const country = await prisma.country.upsert({
        where: { country_id: 1 },
        update: {},
        create: {
            country_id: 1,
            country_name: 'Türkiye',
            slug: 'turkiye',
        },
    });

    const city = await prisma.city.upsert({
        where: { city_id: 34 },
        update: {},
        create: {
            city_id: 34,
            city_name: 'İstanbul',
            slug: 'istanbul',
            country_id: country.country_id,
            country_name: country.country_name,
        },
    });

    const district = await prisma.district.upsert({
        where: { district_id: 1 },
        update: {},
        create: {
            district_id: 1,
            district_name: 'Beşiktaş',
            city_id: city.city_id,
            city_name: city.city_name,
            slug: 'besiktas',
        },
    });

    const neighborhood = await prisma.neighborhood.upsert({
        where: { neighborhood_id: 1 },
        update: {},
        create: {
            neighborhood_id: 1,
            neighborhood_name: 'Levent',
            city_id: city.city_id,
            city_name: city.city_name,
            district_id: district.district_id,
            district_name: district.district_name,
            slug: 'levent',
        },
    });

    // 3. Get or create Office
    let office = await prisma.office.findFirst({
        where: { slug: 'besiktas-merkez-ofis' }
    });

    if (!office) {
        office = await prisma.office.create({
            data: {
                name: 'Beşiktaş Merkez Ofis',
                description: 'İstanbul Beşiktaş ana ofisimiz',
                email: 'besiktas@emlak.com',
                phone: '0212 222 33 44',
                fax: '0212 222 33 45',
                streetAddress: 'Büyükdere Cad. No:123',
                zip: '34330',
                latitude: 41.0766,
                longitude: 29.0133,
                cityId: city.city_id,
                countryId: country.country_id,
                districtId: district.district_id,
                neighborhoodId: neighborhood.neighborhood_id,
                organizationId: organization.id,
                slug: 'besiktas-merkez-ofis',
                webUrl: 'https://besiktas-emlak.com',
                xAccountId: '',
                facebookAccountId: '',
                linkedInAccountId: '',
                instagramAccountId: '',
                youtubeAccountId: '',
            },
        });
    }

    // 4. Create Projects
    const projectsData = [
        {
            name: 'Skyline Residences',
            description: 'Modern mimarisi ve eşsiz Boğaz manzarasıyla lüks yaşamın yeni adresi. Akıllı ev sistemleri ve 7/24 güvenlik hizmetiyle konforunuz dşünüldü.',
            slug: 'skyline-residences',
            assignedAgents: 'Ahmet Yılmaz, Ayşe Demir',
            publishingStatus: 'PUBLISHED',
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-12-31'),
            deedInfo: 'Kat Mülkiyeti',
            landArea: '5000 m2',
            nOfUnits: '120',
            location: {
                streetAddress: 'Levent Mah. Cömert Sok. No:5',
                city: 'İstanbul',
                state: 'Beşiktaş',
                zip: '34330',
                country: 'Türkiye',
                district: 'Beşiktaş',
                neighborhood: 'Levent',
                latitude: 41.0805,
                longitude: 29.0115,
            },
            unitSizes: ['1+1 (75 m2)', '2+1 (110 m2)', '3+1 (165 m2)'],
            socialFeatures: ['Yüzme Havuzu', 'Fitness Center', 'Sauna', 'Kapalı Otopark', 'Çocuk Parkı'],
            images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1460317442991-0ec2393e3d96?q=80&w=1000&auto=format&fit=crop',
            ],
        },
        {
            name: 'Garden Valley Houses',
            description: 'Şehrin gürültüsünden uzak, doğayla iç içe huzurlu bir yaşam. Geniş bahçe alanları ve organik tarım imkanlarıyla fark yaratan bir proje.',
            slug: 'garden-valley-houses',
            assignedAgents: 'Mehmet Öz',
            publishingStatus: 'PUBLISHED',
            startDate: new Date('2023-06-01'),
            endDate: new Date('2025-06-01'),
            deedInfo: 'Kat İrtifakı',
            landArea: '12000 m2',
            nOfUnits: '45 Villa',
            location: {
                streetAddress: 'Zekeriyaköy Cad. No:88',
                city: 'İstanbul',
                state: 'Sarıyer',
                zip: '34450',
                country: 'Türkiye',
                district: 'Sarıyer',
                neighborhood: 'Zekeriyaköy',
                latitude: 41.2015,
                longitude: 29.0255,
            },
            unitSizes: ['4+1 Müstakil', '5+2 İkiz Villa'],
            socialFeatures: ['Tenis Kortu', 'Binicilik Alanı', 'Organik Bahçe', 'Yürüyüş Parkuru'],
            images: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1000&auto=format&fit=crop',
            ],
        }
    ];

    for (const p of projectsData) {
        const existingProject = await prisma.project.findFirst({
            where: { slug: p.slug }
        });

        if (existingProject) {
            console.log(`ℹ️ Project already exists: ${p.name}`);
            continue;
        }

        const project = await prisma.project.create({
            data: {
                name: p.name,
                description: p.description,
                slug: p.slug,
                officeId: office.id,
                organizationId: organization.id,
                assignedAgents: p.assignedAgents,
                publishingStatus: p.publishingStatus,
                startDate: p.startDate,
                endDate: p.endDate,
                deedInfo: p.deedInfo,
                landArea: p.landArea,
                nOfUnits: p.nOfUnits,
                location: {
                    create: p.location,
                },
                unitSizes: {
                    create: p.unitSizes.map(v => ({ value: v })),
                },
                socialFeatures: {
                    create: p.socialFeatures.map(v => ({ value: v })),
                },
                images: {
                    create: p.images.map((url, index) => ({ url, order: index })),
                },
            },
        });
        console.log(`✅ Project seeded: ${project.name}`);
    }

    console.log('✨ Seed completed successfully!');
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
