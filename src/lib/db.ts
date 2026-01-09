import { PrismaClient } from "@prisma/client" 
import { PrismaPg } from '@prisma/adapter-pg'

// To avoid creating multiple instances of PrismaClient in development due to hot module reloading
const globalForPrisma = global as unknown as {
    prisma  : PrismaClient 
    adapter : PrismaPg
}

const adapter = globalForPrisma.adapter || new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const pClient = globalForPrisma.prisma || new PrismaClient({adapter}) ; 

if(process.env.NODE_ENV !== "production"){
    globalForPrisma.prisma  = pClient  ;
    globalForPrisma.adapter = adapter ;
}

export default pClient ;