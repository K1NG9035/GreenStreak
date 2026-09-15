import { prisma } from "@/lib/prisma";
import { demoUserEmail } from "@/lib/utils";

export async function getDemoUser() {
  return prisma.user.upsert({ where: { email: demoUserEmail }, update: {}, create: { email: demoUserEmail } });
}