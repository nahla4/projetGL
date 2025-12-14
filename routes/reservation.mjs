import express from "express";
import {
  createReservation,
  myReservations,
  guideRequests,
  approveReservation,
  proposeNewDate,
  acceptProposedDate,
} from "../controllers/reservation.mjs";

import { protect } from "../middlewares/auth.mjs";

// Router for reservation routes
const reservationRouter = express.Router();

// Create reservation
reservationRouter.post("/", protect, createReservation);

// Get my reservations
reservationRouter.get("/my", protect, myReservations);

// Get guide requests
reservationRouter.get("/guide", protect, guideRequests);

// Approve reservation
reservationRouter.patch("/:id/approve", protect, approveReservation);

// Propose new date
reservationRouter.patch("/:id/propose-new-date", protect, proposeNewDate);

// Accept proposed date
reservationRouter.patch("/:id/accept-new-date", protect, acceptProposedDate);

export default reservationRouter;
