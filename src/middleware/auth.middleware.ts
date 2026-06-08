import {
    Request,
    Response,
    NextFunction,
  } from "express";
  
  import jwt from "jsonwebtoken";

  import User from "../modules/users/user.model";
  
  export interface AuthRequest extends Request {
    user?: any;
  }
  
  export const protect =  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token =
        req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
  
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      );
  
      req.user = await User.findById(decoded.id);
  
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }
  };

  export const authorize = (...roles: string[]) => {
    return (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden",
        });
      }
  
      next();
    };
  };


