/**
 * Whether to actually connect to Upstash Redis.
 *
 * Returns true only when running on Vercel with the Upstash env vars
 * configured. Locally — including `bun start` after a production build with
 * `.env` populated — we noop, so a missing network or stale endpoint can't
 * spam logs with `getaddrinfo ENOTFOUND` traces.
 */
export function shouldUseRedis(): boolean {
  return Boolean(
    process.env.VERCEL &&
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
  );
}
