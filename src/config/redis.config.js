import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv()

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,

  prefix: "@upstash/ratelimit",
});
export  {redis,ratelimit};