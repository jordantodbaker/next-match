import { PrismaClient } from "@prisma/client";
import { withDbRetry } from "./dbRetry";

function createPrismaClient() {
  return new PrismaClient({
    // Logging every query is useful locally but is pure overhead/noise in
    // production, where we only care about errors.
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends({
    query: {
      // Retry every query on a transient connection failure (e.g. Neon waking
      // from auto-suspend) so the cold-start blip doesn't surface as a 500.
      async $allOperations({ args, query }) {
        return withDbRetry(() => query(args));
      },
    },
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
