import express from "express";
import connectDB from "./database/db.js"
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import scheduleRoutes from "./routes/scheduleRoutes.js";


dotenv.config({});

const app = express();
app.use(express.json());

// Default middlewares
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());

//apis
app.use("/api/v1/user", userRoutes);
app.use("/api/schedule", scheduleRoutes);

// call the connectDB function
connectDB();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});