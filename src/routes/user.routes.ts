import { Router } from "express";
import { addUser, getUser } from "../controllers/user.controller.js";
import { rateLimit } from "../middleware/rate_limiter.middleware.js";

const router = Router();

router.post("/", addUser);

router.get(
  "/:id",
  rateLimit({
    capacity: 10,
    refillRate: 1 / 60,
    scope: "users",
  }),
  getUser,
);

export default router;
