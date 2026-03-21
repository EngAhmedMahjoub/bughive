// prisma/client.ts
import { PrismaClient } from "@prisma/client";

// Declare a global variable to hold the Prisma client instance
// This is necessary to avoid instantiating a new client in development mode
// due to Next.js HMR (Hot Module Replacement)
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a single instance if one doesn't already exist
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // Optional: Log all queries to the console
  });

// In production, ensure the global instance is used
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
