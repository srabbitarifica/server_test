import express from "express";
import bcrypt from "bcrypt";
import { pool } from "../index.js";

const router = express.Router();

router.post("/signup", async (req: any, res: any) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Email, username, and password are required." });
  }

  console.log("username", username, "email", email);
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    pool.query(sql, [username, email, hashedPassword], (err, result) => {
      console.log("MySQL Error:", err);
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "Username or email already exists." });
        }

        console.error("Error signing up:", err);
        return res.status(500).json({ message: "Internal server error." });
      }

      res.json({ message: "Sign up successful Please log back in." });
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
