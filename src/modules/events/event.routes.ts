import express from "express";

import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
} from "./event.controller";

import {
  protect,
  authorize,
} from "../../middleware/auth.middleware";


const router = express.Router();

router.post(
  "/",
  protect,
  authorize("creator"),
  createEvent
);

router.get("/", getEvents);

router.get(
  "/my-events",
  protect,
  authorize("creator"),
  getMyEvents
);

router.get(
  "/:eventId",
  getEventById
);

export default router;