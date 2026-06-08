import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {

    await connectDB();

    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });

  } catch (error) {
    console.log(error);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();  
  import("./jobs/reminder.worker").catch(console.error);
}

