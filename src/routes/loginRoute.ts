import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../index.js";

interface UserRow {
  username: string;
  password: string;
}

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    const userQuery = "SELECT * FROM users WHERE username = ?";
    pool.query(userQuery, [username], async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ message: "Internal server error." });
      }

      const userRows = results as UserRow[];

      if (userRows.length === 0) {
        return res.status(401).json({ message: "User not found." });
      }

      const user = userRows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "30m",
        }
      );

      res.cookie("token", token, {
        maxAge: 1800000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.json({ message: "Login successful.", token });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
