import type { Request, Response } from "express";
import { getProducts, createProduct } from "../services/product.service.js";

export async function listProducts(req: Request, res: Response) {
  const products = await getProducts();

  return res.json({
    products,
    server: process.env.SERVER_NAME,
  });
}

export async function addProduct(req: Request, res: Response) {
  const userId = req.header("X-User-Id");

  if (!userId) {
    return res.status(400).json({
      message: "X-User-Id header is required",
    });
  }

  const { name, price } = req.body;

  const product = await createProduct(userId, name, price);

  return res.status(201).json({
    product,
    server: process.env.SERVER_NAME,
  });
}
