import { redisClient } from "../config/redis";

afterAll(async () => {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
});