import { Queue } from "bullmq";

export const reminderQueue = new Queue(
  "event-reminders",
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  }
);