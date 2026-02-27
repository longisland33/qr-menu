import { PrismaClient } from "@prisma/client";

// Global nüsxəni yaradırıq (Development zamanı Hot Reload əlaqəni qırmasın deyə)
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // Geliştirme modunda global dəyişən istifadə edirik
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };