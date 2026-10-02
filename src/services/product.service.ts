import { prisma } from "../lib/prisma.js";

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createProduct(
  userId: string,
  name: string,
  price: number,
) {
  return prisma.product.create({
    data: { name, price, userId },
  });
}
