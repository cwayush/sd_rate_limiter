import type { Request, Response } from "express";
import { createUser, getUserById } from "../services/user.service.js";

export async function addUser(req: Request, res: Response) {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        message: "Email or Name are required",
      });
    }

    const user = await createUser(email, name);

    return res.status(201).json({
      user,
      server: process.env.SERVER_NAME,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to create user",
    });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.json({
      user,
      server: process.env.SERVER_NAME,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
}
