import { PrismaClient } from '@prisma/client/extension';
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prevent multiple instances in development (hot-reload)
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // log: ['query', 'info', 'warn', 'error'], // Uncomment for verbose logs in development
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
