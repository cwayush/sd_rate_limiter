import { prisma } from "../lib/prisma.js";

export async function createUser(email: string, name: string) {
  return prisma.user.create({
    data: { email, name },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
}
