import jwt from "jsonwebtoken";
import crypto from 'crypto';

const secretKey = "fojIDg7*F(YouhESf&(HUPifEAP*(&(WHUdf&(EGPF8hoJI&WGEF79EPUONJFg&W(E(FphUOW&GfCPH(*WUO:Ns"

export function generateToken(data: any): any {
  const token = jwt.sign(data, secretKey,{ expiresIn: "30m" });
  return token;
}

export function authenticateUser(username: any, password: any): boolean {
  // Simulate user authentication logic
  return username === "testuser" && password === "password";
}


// post("/login", (req: any, res: any) => {
//     const { username, password } = req.body;
  
//     if (!username || !password) {
//       return res
//         .status(400)
//         .json({ message: "Username and password are required." });
//     }
  
//     if (!authenticateUser(username, password)) {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }
  
//     const token = generateToken({ username });
  
//     // Set the token in a cookie
//     res.cookie("token", token, {
//       maxAge: 1800000,
//       httpOnly: true,
//       sameSite: "none",
//       secure: true,
//     });
  
//     res.json({ message: "Login successful.", token });
//   });