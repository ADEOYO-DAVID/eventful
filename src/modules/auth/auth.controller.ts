import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../users/user.model";
import { generateToken } from "../../utils/token";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
  
    return res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  }catch (error: any) {
    console.error("LOGIN ERROR:");
  
    console.error(error);
  
    console.error(error.message);
  
    console.error(error.stack);
  
    return res.status(500).json({
      message: "Server Error",
      errorMessage: error.message,
    });
  }
};