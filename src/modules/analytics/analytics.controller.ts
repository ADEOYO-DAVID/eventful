import { Request, Response } from "express";
import Event from "../events/event.model";
import Ticket from "../tickets/ticket.model";

export const getAnalytics = async (
    req: Request,
    res: Response
  ) => {
    try {
  
      const totalEvents =
        await Event.countDocuments();
  
      const totalTickets =
        await Ticket.countDocuments();
  
      const totalScanned =
        await Ticket.countDocuments({
          scanned: true,
        });
  
      return res.status(200).json({
        totalEvents,
        totalTickets,
        totalScanned,
      });
  
    } catch (error) {
  
      console.log(error);
  
      return res.status(500).json({
        message: "Server Error",
      });
  
    }
  };



export const getEventAnalytics =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const { eventId } = req.params;

      const event =
        await Event.findById(eventId);

      if (!event) {
        return res.status(404).json({
          message: "Event not found",
        });
      }

      const ticketsSold =
        await Ticket.countDocuments({
          eventId,
        });

      const attendees =
        await Ticket.countDocuments({
          eventId,
          scanned: true,
        });

      return res.status(200).json({
        eventTitle: event.title,
        ticketsSold,
        attendees,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        message: "Server Error",
      });

    }
  };