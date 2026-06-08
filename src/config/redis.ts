import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

export const connectRedis = async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Skipping Redis in test mode");
    return;
  }

  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.log("Redis connection error:", error);
  }
};