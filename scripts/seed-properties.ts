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

const sampleProperties = [
    {
        name: "Modern Bahçeli Villa",
        description: "Şehir merkezine yakın, geniş bahçeli ve havuzlu lüks villa. 3 katlı, otoparklı.",
        price: 15000000,
        priceRange: 2000000,
        discountedPrice: 14500000,
        // typeId, subTypeId, statusId, contractId, deedStatusId will be resolved dynamically
        feature: {
            bedrooms: "5+1",
            bathrooms: 4,
            floor: 0,
            totalFloor: 3,
            area: 350,
            grossArea: 400,
            zoningStatus: true,
            parcelNumber: 123,
            blockNumber: 456,
            hasSwimmingPool: true,
            hasGardenYard: true,
            hasBalcony: true,
        },
        location: {
            streetAddress: "Lale Sokak No: 15",
            state: "Bölge",
            zip: "34000",
            country: "Türkiye",
            landmark: "Merkez Park Yanı",
        },
    },
    {
        name: "Deniz Manzaralı Rezidans Daire",
        description: "Panoramik deniz manzaralı, akıllı ev sistemli, güvenli sitede lüks daire.",
        price: 8500000,
        priceRange: 1000000,
        discountedPrice: 0,
        feature: {
            bedrooms: "3+1",
            bathrooms: 2,
            floor: 15,
            totalFloor: 20,
            area: 160,
            grossArea: 185,
            zoningStatus: true,
            parcelNumber: 789,
            blockNumber: 101,
            hasSwimmingPool: true,
            hasGardenYard: false,
            hasBalcony: true,
        },
        location: {
            streetAddress: "Sahil Yolu Cd. No: 40",
            state: "Bölge",
            zip: "35000",
            country: "Türkiye",
            landmark: "Marina Karşısı",
        },
    },
    {
        name: "Merkezi Konumda Ofis Katı",
        description: "Plazalar bölgesinde, metroya 2 dk yürüme mesafesinde hazır ofis.",
        price: 25000,
        priceRange: 5000,
        discountedPrice: 0,
        feature: {
            bedrooms: "1+0",
            bathrooms: 1,
            floor: 5,
            totalFloor: 12,
            area: 90,
            grossArea: 100,
            zoningStatus: true,
            parcelNumber: 222,
            blockNumber: 333,
            hasSwimmingPool: false,
            hasGardenYard: false,
            hasBalcony: false,
        },
        location: {
            streetAddress: "İş Merkezi Sk. No: 5",
            state: "Bölge",
            zip: "06000",
            country: "Türkiye",
            landmark: "Metro Çıkışı",
        },
    },
];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
    console.log("Starting property seeding...");

    // 1. Fetch Lookups
    const types = await prisma.propertyType.findMany({ include: { subTypes: true } });
    const statuses = await prisma.propertyStatus.findMany();
    const contracts = await prisma.propertyContract.findMany();
    const deedStatuses = await prisma.propertyDeedStatus.findMany();

    if (!types.length || !statuses.length || !contracts.length || !deedStatuses.length) {
        console.error("Missing lookup data (Types/Statuses/Contracts). Run basic seeds first.");
        return;
    }

    // 2. Get all offices
    const offices = await prisma.office.findMany({
        include: {
            workers: {
                where: {
                    role: {
                        slug: {
                            not: "ofis-yoneticisi",
                        },
                    },
                },
            },
            city: true,
            district: true,
        },
    });

    if (offices.length === 0) {
        console.error("No offices found. Please define offices first.");
        return;
    }

    // 3. Iterate through offices
    for (const office of offices) {
        if (office.workers.length === 0) {
            console.log(`Office ${office.name} has no eligible agents. Skipping...`);
            continue;
        }

        console.log(`Seeding properties for office: ${office.name} (${office.city.city_name})`);

        for (let i = 0; i < sampleProperties.length; i++) {
            const sample = sampleProperties[i];
            const agent = office.workers[i % office.workers.length];

            if (!agent.userId) {
                console.warn(`Agent ${agent.name} has no linked User ID. Skipping assignment.`);
                continue;
            }

            const propertyName = `${sample.name} - ${office.district.district_name} - ${i}`;

            const existing = await prisma.property.findFirst({
                where: {
                    name: propertyName,
                    agentId: agent.id
                }
            });

            if (existing) {
                // console.log(`Property "${propertyName}" already exists. Skipping.`);
                continue;
            }

            // Resolve valid IDs dynamically
            const validContract = getRandom(contracts);
            const validStatus = getRandom(statuses);
            const validDeed = getRandom(deedStatuses);

            const validType = getRandom(types);
            const validSubType = getRandom(validType.subTypes);

            if (!validSubType) {
                console.warn(`No subtypes found for type ${validType.value}. Skipping property.`);
                continue;
            }

            const randomPrice = sample.price + (Math.floor(Math.random() * 20) - 10) * (sample.priceRange / 100);

            try {
                await prisma.property.create({
                    data: {
                        name: propertyName,
                        description: sample.description,
                        price: Math.floor(randomPrice),
                        discountedPrice: sample.discountedPrice,
                        userId: agent.userId,
                        organizationId: office.organizationId,
                        typeId: validType.id,
                        subTypeId: validSubType.id,
                        statusId: validStatus.id,
                        agentId: agent.id,
                        contractId: validContract.id,
                        videoSource: "",
                        threeDSource: "",
                        deedStatusId: validDeed.id,
                        location: {
                            create: {
                                streetAddress: sample.location.streetAddress,
                                city: office.city.city_name,
                                district: office.district.district_name,
                                neighborhood: "Merkez Mah.",
                                state: sample.location.state,
                                zip: sample.location.zip,
                                country: sample.location.country,
                                landmark: sample.location.landmark,
                                region: office.city.city_name,
                                latitude: office.latitude + (Math.random() * 0.01 - 0.005),
                                longitude: office.longitude + (Math.random() * 0.01 - 0.005),
                            }
                        },
                        feature: {
                            create: sample.feature
                        },
                        images: {
                            create: [
                                { url: `https://picsum.photos/seed/${agent.id}-${i}-1/800/600`, order: 0 },
                                { url: `https://picsum.photos/seed/${agent.id}-${i}-2/800/600`, order: 1 }
                            ]
                        }
                    }
                });
                console.log(`Created property: ${propertyName} (Type: ${validType.value})`);
            } catch (error) {
                console.error(`Failed to create property for office ${office.name}:`, error);
            }
        }
    }

    console.log("Seeding complete.");
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
