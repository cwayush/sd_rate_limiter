import { Router } from "express";
import { listProducts, addProduct } from "../controllers/product.controller.js";
import { rateLimit } from "../middleware/rate_limiter.middleware.js";

const router = Router();

router.get(
  "/",
  rateLimit({
    capacity: 10,
    refillRate: 1,
    scope: "products-list",
  }),
  listProducts,
);

router.post(
  "/",
  rateLimit({
    capacity: 5,
    refillRate: 1 / 60,
    scope: "products-create",
  }),
  addProduct,
);

export default router;
