import express from "express";

import {
  getMyTickets,
} from "./ticket.controller";

import {
  protect,
  authorize,
} from "../../middleware/auth.middleware";

import { scanTicket }
from "./scanTicket";

const router = express.Router();

router.get(
  "/my-tickets",
  protect,
  getMyTickets
);

router.patch(
    "/scan/:ticketId",
    protect,
    authorize("creator"),
    scanTicket
  );

export default router;