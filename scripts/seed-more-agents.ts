
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
    console.log('🌱 Seeding more consultants...');

    const agentRole = await prisma.role.findFirst({
        where: { slug: 'agent' }
    });

    if (!agentRole) {
        console.error('Role "agent" not found!');
        return;
    }

    const offices = await prisma.office.findMany({
        where: {
            slug: {
                in: ['ankara-cankaya-ofisi', 'izmir-konak-ofisi', 'bursa-nilufer-ofisi']
            }
        }
    });

    const additionalAgents = [
        { name: 'Can', surname: 'Yılmaz', officeSlug: 'ankara-cankaya-ofisi', email: 'can@ankara.com', phone: '0532 111 22 33' },
        { name: 'Demet', surname: 'Akın', officeSlug: 'ankara-cankaya-ofisi', email: 'demet@ankara.com', phone: '0532 111 22 44' },
        { name: 'Erol', surname: 'Bulut', officeSlug: 'izmir-konak-ofisi', email: 'erol@izmir.com', phone: '0532 111 22 55' },
        { name: 'Funda', surname: 'Arar', officeSlug: 'izmir-konak-ofisi', email: 'funda@izmir.com', phone: '0532 111 22 66' },
        { name: 'Gökhan', surname: 'Özoğuz', officeSlug: 'bursa-nilufer-ofisi', email: 'gokhan@bursa.com', phone: '0532 111 22 77' },
        { name: 'Hale', surname: 'Soygazi', officeSlug: 'bursa-nilufer-ofisi', email: 'hale@bursa.com', phone: '0532 111 22 88' },
    ];

    for (const agentData of additionalAgents) {
        const office = offices.find(o => o.slug === agentData.officeSlug);
        if (!office) continue;

        const existingAgent = await prisma.officeWorker.findFirst({
            where: { email: agentData.email }
        });

        if (existingAgent) {
            console.log(`ℹ️ Agent already exists: ${agentData.name} ${agentData.surname}`);
            continue;
        }

        await prisma.officeWorker.create({
            data: {
                name: agentData.name,
                surname: agentData.surname,
                email: agentData.email,
                phone: agentData.phone,
                roleId: agentRole.id,
                officeId: office.id,
                about: `${office.name} bünyesinde gayrimenkul danışmanı.`,
                slug: `${agentData.name.toLowerCase()}-${agentData.surname.replace(/\s+/g, '-').toLowerCase()}`,
                xAccountId: '',
                facebookAccountId: '',
                linkedInAccountId: '',
                instagramAccountId: '',
                youtubeAccountId: '',
                webUrl: '',
                commercialDocumentId: '',
                companyLegalName: '',
            }
        });
        console.log(`✅ Seeded agent: ${agentData.name} ${agentData.surname} for ${office.name}`);
    }

    console.log('✨ Additional consultant seeding completed!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
