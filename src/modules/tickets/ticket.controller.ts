import { Response } from "express";
import Ticket from "./ticket.model";
import { AuthRequest } from "../../middleware/auth.middleware";

export const getMyTickets = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const tickets = await Ticket.find({
      userId: req.user._id,
    })
      .populate("eventId");

    return res.status(200).json(
      tickets
    );

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }
};