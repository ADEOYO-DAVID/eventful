import { Queue } from "bullmq";

export const reminderQueue = new Queue(
  "event-reminders",
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);