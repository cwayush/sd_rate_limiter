import { Router } from "express";
import { rateLimit } from "../middleware/rate_limiter.middleware.js";

const router = Router();

router.get(
  "/normal",
  rateLimit({
    capacity: 10,
    refillRate: 1,
    scope: "normal",
  }),
  (_req, res) => {
    res.json({
      message: "Request allowed",
      server: process.env.SERVER_NAME,
    });
  },
);

router.post(
  "/sensitive",
  rateLimit({
    capacity: 5,
    refillRate: 1 / 60,
    scope: "sensitive",
  }),
  (_req, res) => {
    res.json({
      message: "Sensitive Request allowed",
      server: process.env.SERVER_NAME,
    });
  },
);

export default router;
