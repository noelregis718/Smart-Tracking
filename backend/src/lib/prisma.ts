import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient() as any;

export { PrismaClient };
export default prisma;
