import express from "express";
const router = express.Router();

import {
  authenticate,
  authorizeGuide,
  authorizeTourist,
  checkVerified,
} from "../middlewares/auth.mjs";

import * as ReservationController from "../controllers/reservation.mjs";

import {
  validateReservationCreation,
  validateReservationStatusUpdate,
} from "../validators/reservationValidator.mjs";

import { validate } from "../middlewares/validate.mjs";

//  CREATE RESERVATION (Tourist)
router.post(
  "/",
  authenticate,
  authorizeTourist,
  checkVerified,
  validateReservationCreation,
  validate,
  ReservationController.createReservation
);

//  GET SINGLE RESERVATION
// (Tourist or Guide – owner only)
router.get(
  "/:reservationID",
  authenticate,
  ReservationController.getReservationById
);

// GET USER RESERVATIONS
// (Tourist or Guide)
router.get("/", authenticate, ReservationController.getUserReservations);

// GET UPCOMING RESERVATIONS
// Dashboard widget (Tourist / Guide)
router.get(
  "/upcoming/list",
  authenticate,
  ReservationController.getUpcomingReservations
);

// UPDATE STATUS (Guide)
// confirm / cancel / reschedule
router.patch(
  "/:reservationID/status",
  authenticate,
  authorizeGuide,
  checkVerified,
  validateReservationStatusUpdate,
  validate,
  ReservationController.updateReservationStatus
);

// CANCEL RESERVATION
// Tourist or Guide
router.patch(
  "/:reservationID/cancel",
  authenticate,
  ReservationController.cancelReservation
);

// ACCEPT RESCHEDULE (Tourist)
router.patch(
  "/:reservationID/accept-reschedule",
  authenticate,
  authorizeTourist,
  ReservationController.acceptReschedule
);

// REJECT RESCHEDULE (Tourist)
router.patch(
  "/:reservationID/reject-reschedule",
  authenticate,
  authorizeTourist,
  ReservationController.rejectReschedule
);

// UPDATE PAYMENT STATUS
router.patch(
  "/:reservationID/payment",
  authenticate,
  ReservationController.updatePaymentStatus
);

// MARK AS COMPLETED (Guide)
// After endDate
router.patch(
  "/:reservationID/complete",
  authenticate,
  authorizeGuide,
  ReservationController.markAsCompleted
);

// GUIDE STATISTICS
router.get(
  "/stats/guide",
  authenticate,
  authorizeGuide,
  ReservationController.getGuideStatistics
);

// TOURIST STATISTICS
router.get(
  "/stats/tourist",
  authenticate,
  authorizeTourist,
  ReservationController.getTouristStatistics
);

export default router;
