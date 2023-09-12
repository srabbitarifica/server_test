import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import viewDigitalData from "./routes/viewDigitalData.js";
import signupRoute from "./routes/signupRoute.js";
import loginRoute from "./routes/loginRoute.js";
import bodyParser from "body-parser";
import mysql from "mysql2";
const app = express();
app.use(cors());
dotenv.config();
app.use(bodyParser.json());
export const pool = mysql.createPool({
    host: process.env.DIGITAL_DB_HOST,
    user: process.env.DIGITAL_DB_USERNAME,
    password: process.env.DIGITAL_DB_PASSWORD,
    database: process.env.DIGITAL_DB_DATABASE,
    port: parseInt(process.env.DIGITAL_DB_SQLPORT)
});
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        return;
    }
    console.log("Connected to MySQL database!");
    connection.release();
});
app.get("/", (req, res) => {
    res.send("Hello, World");
});
app.get("/data", viewDigitalData);
app.post("/login", loginRoute);
app.post("/signup", signupRoute);
app.listen(process.env.BACKEND_PORT, () => {
    console.log(`Server is running on ${process.env.BACKEND_URL}`);
});
//# sourceMappingURL=index.js.map