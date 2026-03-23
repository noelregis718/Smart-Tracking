import { PrismaClient } from '../../prisma/generated/client';

export const prisma = new PrismaClient();

export { PrismaClient };
export default prisma;
