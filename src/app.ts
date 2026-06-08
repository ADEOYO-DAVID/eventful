import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes";

import eventRoutes from "./modules/events/event.routes";

import paymentRoutes
from "./modules/payments/payment.routes";

import ticketRoutes
from "./modules/tickets/ticket.routes";

import swaggerUi
from "swagger-ui-express";

import swaggerDocument
from "./config/swagger";

import rateLimit
from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests",
});

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use(
  "/payments",
  paymentRoutes
);

app.use(
  "/tickets",
  ticketRoutes
);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(limiter);

app.get("/", (req, res) => {
  res.send("Eventful API Running");
});

export default app;