import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  // Prisma 7 requires adapter when using "client" engine type
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is required. " +
      "Please ensure it's set in your .env file."
    );
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Only create client if DATABASE_URL is available
  // This prevents build-time errors when DATABASE_URL is not set
  if (process.env.DATABASE_URL) {
    globalForPrisma.prisma = createPrismaClient();
    return globalForPrisma.prisma;
  }

  // Return a proxy that will throw a helpful error when accessed
  return new Proxy({} as PrismaClient, {
    get() {
      throw new Error(
        "PrismaClient is not initialized. DATABASE_URL environment variable is required."
      );
    },
  });
}

export const prisma = getPrismaClient();

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
