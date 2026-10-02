import type { Request, Response, NextFunction } from "express";
import {
  checkRateLimit,
  type RateLimitConfig,
} from "../services/rate-limiter.service.js";

export function rateLimit(config: RateLimitConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.header("X-User-Id");

      if (!userId) {
        return res.status(400).json({
          message: "X-User-Id header is required",
        });
      }

      const key = `rate-limit:${config.scope}:user:${userId}`;

      const result = await checkRateLimit(key, config);

      res.setHeader(
        "X-RateLimit-Remaining",
        Math.floor(result.remainingTokens),
      );

      if (!result.allowed) {
        return res.status(429).json({
          message: "Too many requests",
          server: process.env.SERVER_NAME,
        });
      }

      next();
    } catch (err) {
      console.error("Rate Limit error:", err);

      return res.status(500).json({
        message: "Rate Limiter error",
      });
    }
  };
}
