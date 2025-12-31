import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import reservationRouter from "./routes/reservation.mjs";
import userRouter from "./routes/user.mjs";
import customRequestRouter from "./routes/customRequest.mjs";
import tourRouter from "./routes/tour.mjs";

// Load env vars - ensure it's loaded first with override
dotenv.config({ override: true });

// Debug: Log environment variables (without sensitive data)
console.log("Environment variables loaded:");
console.log("  DB_HOST:", process.env.DB_HOST || "NOT SET");
console.log("  DB_USER:", process.env.DB_USER || "NOT SET");
console.log("  DB_NAME:", process.env.DB_NAME || "NOT SET");
console.log("  DB_PASS:", process.env.DB_PASS ? "***SET***" : "NOT SET");
console.log("  JWT_SECRET:", process.env.JWT_SECRET ? "***SET***" : "NOT SET");

// Create app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`, req.query, req.body);
  next();
});

// Routes
app.use("/api/reservations", reservationRouter);
app.use("/api/users", userRouter);
app.use("/api/customRequests", customRequestRouter);
app.use("/api/tours", tourRouter);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`DB_HOST: ${process.env.DB_HOST || "NOT SET"}`);
  console.log(`DB_NAME: ${process.env.DB_NAME || "NOT SET"}`);
});
