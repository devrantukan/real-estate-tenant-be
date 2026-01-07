
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
    console.log('🌱 Starting consultant (OfficeWorker) seed...');

    // 1. Get Organization
    const organization = await prisma.organization.findFirst({
        where: { slug: 'default-org' }
    });

    if (!organization) {
        console.error('❌ Default organization not found. Please run seed-projects.ts first.');
        process.exit(1);
    }

    // 2. Get Office
    const office = await prisma.office.findFirst({
        where: { slug: 'besiktas-merkez-ofis' }
    });

    if (!office) {
        console.error('❌ Beşiktaş Merkez Ofis not found. Please run seed-projects.ts first.');
        process.exit(1);
    }

    // 3. Ensure Roles exist
    const rolesData = [
        { title: 'Site Admin', slug: 'site-admin' },
        { title: 'Danışman', slug: 'agent' },
    ];

    const roles: Record<string, any> = {};
    for (const r of rolesData) {
        roles[r.slug] = await prisma.role.upsert({
            where: { id: (await prisma.role.findFirst({ where: { slug: r.slug } }))?.id || -1 },
            update: {},
            create: {
                title: r.title,
                slug: r.slug,
                organizationId: organization.id
            }
        });
    }

    // 4. Create Consultants
    const consultants = [
        {
            name: 'Ahmet',
            surname: 'Yılmaz',
            email: 'ahmet.yilmaz@emlak.com',
            phone: '0532 111 22 33',
            roleSlug: 'site-admin',
            title: 'Kıdemli Danışman',
            about: '10 yıllık gayrimenkul tecrübesi ile lüks konut uzmanı.',
            slug: 'ahmet-yilmaz',
        },
        {
            name: 'Ayşe',
            surname: 'Demir',
            email: 'ayse.demir@emlak.com',
            phone: '0533 444 55 66',
            roleSlug: 'agent',
            title: 'Gayrimenkul Danışmanı',
            about: 'Ticari gayrimenkul ve yatırım projeleri konusunda uzman.',
            slug: 'ayse-demir',
        },
        {
            name: 'Mehmet',
            surname: 'Öz',
            email: 'mehmet.oz@emlak.com',
            phone: '0544 777 88 99',
            roleSlug: 'agent',
            title: 'Gayrimenkul Danışmanı',
            about: 'Beşiktaş ve Sarıyer bölgesinde konut projeleri uzmanı.',
            slug: 'mehmet-oz',
        }
    ];

    for (const c of consultants) {
        const existing = await prisma.officeWorker.findFirst({
            where: { slug: c.slug }
        });

        if (existing) {
            console.log(`ℹ️ Consultant already exists: ${c.name} ${c.surname}`);
            continue;
        }

        await prisma.officeWorker.create({
            data: {
                name: c.name,
                surname: c.surname,
                email: c.email,
                phone: c.phone,
                roleId: roles[c.roleSlug].id,
                officeId: office.id,
                slug: c.slug,
                title: c.title,
                about: c.about,
                avatarUrl: `https://i.pravatar.cc/150?u=${c.email}`,
                xAccountId: '',
                facebookAccountId: '',
                linkedInAccountId: '',
                instagramAccountId: '',
                youtubeAccountId: '',
                webUrl: '',
                commercialDocumentId: 'DOC-' + Math.floor(100000 + Math.random() * 900000),
                companyLegalName: 'Emlak A.Ş.',
            }
        });
        console.log(`✅ Consultant seeded: ${c.name} ${c.surname}`);
    }

    console.log('✨ Consultant seeding completed successfully!');
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
