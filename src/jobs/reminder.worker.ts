import { Worker } from "bullmq";
import { sendEmail } from "../utils/sendEmail";

new Worker(
  "event-reminders",

  async (job) => {

    await sendEmail(
      job.data.email,
      "Event Reminder",
      `Reminder: ${job.data.title} starts soon`
    );

  },

  {
    connection: {
        url: process.env.REDIS_URL,
      },
  }
);