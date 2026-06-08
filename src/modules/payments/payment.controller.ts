import axios from "axios";
import Event from "../events/event.model";
import { AuthRequest } from "../../middleware/auth.middleware";
import { Response } from "express";

import Ticket from "../tickets/ticket.model";
import { generateQRCode } from "../../utils/qr";
import { reminderQueue } from "../../jobs/reminder.queue";

export const initializePayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount: event.price * 100,
        metadata: {
          eventId,
          userId: req.user._id,
        },
      },
      {
        headers: {
          Authorization:
            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return res.status(200).json(
      response.data
    );

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });

  }
};

export const verifyPayment = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
  
      const reference  = req.params.reference as string;
  
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );
  
      const paymentData = response.data.data;
  
      if (paymentData.status !== "success") {
        return res.status(400).json({
          message: "Payment not successful",
        });
      }
  
      const existingTicket = await Ticket.findOne({
        paymentReference: reference,
      });
  
      if (existingTicket) {
        return res.status(200).json({
          message: "Ticket already exists",
          ticket: existingTicket,
        });
      }
  
      const eventId = paymentData.metadata.eventId;
      const userId = paymentData.metadata.userId;

      const event = await Event.findById(eventId);

      if(!event) {
        return res.status(404).json({
            message: "Event not found",
        });
      }
  
      const qrCode = await generateQRCode({
        reference,
        eventId,
        userId,
      });
  
      const ticket = await Ticket.create({
        userId,
        eventId,
        paymentReference: reference,
        qrCode,
      });

      await reminderQueue.add(
        "event-reminder",
        {
          email: req.user.email,
          title: event.title,
          eventDate: event.startDate,
        },
        {
          delay: 24 * 60 * 60 * 1000,
          removeOnComplete: true,
          removeOnFail: true,
        }
      );

  
      return res.status(201).json({
        message: "Ticket created successfully",
        ticket,
      });
      
  
    } catch (error) {
  
      console.log(error);
  
      return res.status(500).json({
        message: "Server Error",
      });
  
    }
  };
  