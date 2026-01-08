import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEV_USER_ID = "e555c443-4da6-4a36-bb2a-db592280e62d"; // From logs
const DEV_USER_EMAIL = "turgaysavaci@gmail.com";

async function main() {
    console.log("Starting user linkage...");

    // 1. Ensure Dev User exists
    await prisma.user.upsert({
        where: { id: DEV_USER_ID },
        update: {},
        create: {
            id: DEV_USER_ID,
            firstName: "Turgay",
            lastName: "Savaci",
            email: DEV_USER_EMAIL,
            organizationId: 1, // Default org
        }
    });
    console.log("Dev user upserted.");

    // 2. Get all agents without userId
    const agents = await prisma.officeWorker.findMany({
        where: { userId: null }
    });

    console.log(`Found ${agents.length} agents without users.`);

    for (const [index, agent] of agents.entries()) {
        let userIdToLink = "";

        // Link first agent to Dev User
        if (index === 0) {
            userIdToLink = DEV_USER_ID;
            console.log(`Linking Agent ${agent.name} to Dev User (${DEV_USER_ID})`);
        } else {
            // Create dummy user for others
            const dummyId = `dummy-user-${agent.id}`;
            await prisma.user.upsert({
                where: { id: dummyId },
                update: {},
                create: {
                    id: dummyId,
                    firstName: agent.name,
                    lastName: agent.surname,
                    email: agent.email, // Assuming unique emails or use dummy
                    organizationId: agent.officeId ? 1 : null,
                }
            });
            userIdToLink = dummyId;
            console.log(`Linking Agent ${agent.name} to Dummy User (${dummyId})`);
        }

        // Update Agent
        await prisma.officeWorker.update({
            where: { id: agent.id },
            data: { userId: userIdToLink }
        });
    }

    console.log("Linkage complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
