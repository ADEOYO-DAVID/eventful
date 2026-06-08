import express from "express";

import {
  initializePayment,
  verifyPayment,
} from "./payment.controller";

import {
  protect,
} from "../../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/initialize",
  protect,
  initializePayment
);

router.get(
  "/verify/:reference",
  protect,
  verifyPayment
);

export default router;