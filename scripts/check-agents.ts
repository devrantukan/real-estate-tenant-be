
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
    const offices = await prisma.office.findMany({
        include: {
            workers: true
        }
    });
    console.log('Offices and Workers:');
    offices.forEach(o => {
        console.log(`- ${o.name} (id: ${o.id}, slug: ${o.slug})`);
        o.workers.forEach(w => {
            console.log(`  * ${w.name} ${w.surname} (id: ${w.id})`);
        });
    });
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
