import { Request, Response } from "express";
import Event from "./event.model";
import { AuthRequest } from "../../middleware/auth.middleware";
import { redisClient } from "../../config/redis";

export const createEvent = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const event = await Event.create({
      ...req.body,
      creator: req.user._id,
    });

    await redisClient.del("events");

    return res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getEvents = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    let cachedEvents = null;

    try {
      cachedEvents = await redisClient.get("events");
    } catch (err) {
      console.log("Redis not available, skipping cache");
    }

    if (cachedEvents) {
      return res.status(200).json(JSON.parse(cachedEvents));
    }

    const events = await Event.find().populate(
      "creator",
      "name email"
    );

    try {
      await redisClient.set(
        "events",
        JSON.stringify(events),
        { EX: 60 }
      );
    } catch (err) {
      console.log("Redis write failed");
    }

    return res.status(200).json(events);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

  export const getMyEvents = async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const events = await Event.find({
        creator: req.user._id,
      });
  
      return res.status(200).json(events);
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        message: "Server Error",
      });
    }
  };

  type Params = {
    eventId: string;
  };

  export const getEventById = async (
    req: Request<Params>,
    res: Response
  ) => {
    const event = await Event.findById(
      req.params.eventId
    );
  
    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }
  
    return res.status(200).json(event);
  };