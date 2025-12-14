import {
  insertReservation,
  getByTourist,
  getReservationsForGuide,
  updateStatus,
  suggestNewDate,
  acceptSuggestedDate,
  getReservationById,
} from "../models/reservation.mjs";

import {
  calculateDurationHours,
  calculateAmount,
} from "../utils/reservation.mjs";

// Create reservation
export const createReservation = async (req, res) => {
  try {
    if (req.user.role !== "tourist") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { tourID, startDate, endDate } = req.body;
    const touristID = req.user.userID;

    const guide = {
      halfDayPrice: 5000,
      fullDayPrice: 8000,
      extraHourPrice: 1000,
    };

    const hours = calculateDurationHours(startDate, endDate);
    const amount = calculateAmount(hours, guide);

    const id = await insertReservation(
      touristID,
      tourID,
      startDate,
      endDate,
      amount
    );

    res.status(201).json({
      message: "Reservation created",
      reservationID: id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get my reservations
export const myReservations = async (req, res) => {
  try {
    const data = await getByTourist(req.user.userID);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get guide requests
export const guideRequests = async (req, res) => {
  try {
    const data = await getReservationsForGuide(req.user.userID);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve reservation
export const approveReservation = async (req, res) => {
  try {
    const reservation = await getReservationById(req.params.id);

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    if (reservation.guideID !== req.user.userID)
      return res.status(403).json({ message: "Access denied" });

    await updateStatus(req.params.id, "approved");
    res.json({ message: "Reservation approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Propose new date
export const proposeNewDate = async (req, res) => {
  try {
    const reservation = await getReservationById(req.params.id);

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    if (reservation.guideID !== req.user.userID)
      return res.status(403).json({ message: "Access denied" });

    const { suggestedStartDate, suggestedEndDate } = req.body;

    await suggestNewDate(req.params.id, suggestedStartDate, suggestedEndDate);
    res.json({ message: "New date proposed to the tourist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Accept proposed date
export const acceptProposedDate = async (req, res) => {
  try {
    const reservation = await getReservationById(req.params.id);

    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    if (reservation.touristID !== req.user.userID)
      return res.status(403).json({ message: "Access denied" });

    await acceptSuggestedDate(req.params.id, req.user.userID);
    res.json({ message: "Suggested date accepted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
