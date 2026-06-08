import { Response } from "express";
import Ticket from "./ticket.model";
import Event from "../events/event.model";
import { AuthRequest } from "../../middleware/auth.middleware";

export const scanTicket = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const event = await Event.findById(
      ticket.eventId
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (!event.creator) {
      return res.status(404).json({
        message: "Event creator not found",
      });
    }

    if (
        event.creator.toString() !==
        req.user._id.toString()
    ) {
        return res.status(403).json({
            message: "Not authorized",
        })
    }

    if (ticket.scanned) {
      return res.status(400).json({
        message: "Ticket already used",
      });
    }

    ticket.scanned = true;

    await ticket.save();

    return res.status(200).json({
      message: "Entry granted",
      ticket,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }
};