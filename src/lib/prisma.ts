import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {prisma: PrismaClient}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Logging every query is useful locally but is pure overhead/noise in
    // production, where we only care about errors.
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if(process.env.NODE_ENV !== 'production') { globalForPrisma.prisma = prisma; }