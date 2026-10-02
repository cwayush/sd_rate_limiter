-- Get the rate limiter Redis key
local key = KEYS[1]

-- Maximum tokens the bucket can hold
local capacity = tonumber(ARGV[1])

-- Tokens added per second
local refill_rate = tonumber(ARGV[2])

-- Tokens this request wants
local requested_tokens = tonumber(ARGV[3])

-- Get current Redis server time
local current_time = redis.call("TIME")

-- Convert time to seconds with microsecond precision
local now = tonumber(current_time[1]) + tonumber(current_time[2]) / 1000000

-- Get current bucket state
local bucket = redis.call("HMGET", key, "tokens", "last_refill")

-- Read available tokens
local tokens = tonumber(bucket[1])

-- Read last refill time
local last_refill = tonumber(bucket[2])

-- Create a new full bucket if this is the first request
if tokens == nil then
	tokens = capacity
	last_refill = now
end

-- Find how much time has passed
local elapsed = now - last_refill

-- Calculate newly generated tokens
local refilled_tokens = elapsed * refill_rate

-- Add new tokens, but don't exceed capacity
tokens = math.min(capacity, tokens + refilled_tokens)

-- Start with request rejected
local allowed = 0

-- Allow only if enough tokens are available
if tokens >= requested_tokens then
	-- Consume the requested tokens
	tokens = tokens - requested_tokens

	-- Mark request as allowed
	allowed = 1
end

-- Save the updated bucket state
redis.call("HSET", key, "tokens", tokens, "last_refill", now)

-- Remove inactive bucket after some time
redis.call("EXPIRE", key, math.ceil(capacity / refill_rate) + 60)

-- Return whether allowed and remaining tokens
return {
	allowed,
	tokens,
}
