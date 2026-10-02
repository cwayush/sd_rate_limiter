import fs from "node:fs";
import path from "node:path";
import { redis } from "../config/redis.js";

export interface RateLimitConfig {
  capacity: number;
  refillRate: number;
  scope: string;
  cost?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingTokens: number;
}

const luascript = fs.readFileSync(
  path.join(process.cwd(), "src/lib/token-bucket.lua"),
  "utf8",
);

export async function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const cost = config.cost ?? 1;

  const result = (await redis.eval(luascript, {
    keys: [key],
    arguments: [
      String(config.capacity),
      String(config.refillRate),
      String(cost),
    ],
  })) as [number, number];

  return {
    allowed: result[0] === 1,
    remainingTokens: Number(result[1]),
  };
}
