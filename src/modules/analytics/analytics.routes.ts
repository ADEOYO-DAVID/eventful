import express from "express";

import {
  getAnalytics,
  getEventAnalytics,
} from "./analytics.controller";

const router = express.Router();

router.get("/", getAnalytics);

router.get(
  "/event/:eventId",
  getEventAnalytics
);

export default router;