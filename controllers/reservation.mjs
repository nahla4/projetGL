import * as ReservationModel from "../models/reservation.mjs";

// Create a new reservation
export const createReservation = async (req, res) => {
  try {
    const { tourID, startDate, endDate, numberOfPeople } = req.body;
    const touristID = req.user.userID;

    // Validate number of people
    if (!numberOfPeople || numberOfPeople < 1) {
      return res.status(400).json({
        success: false,
        message: "Le nombre de personnes doit être au moins 1",
      });
    }

    if (numberOfPeople > 50) {
      return res.status(400).json({
        success: false,
        message: "Le nombre maximum de personnes est 50",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({
        success: false,
        message: "La date de début doit être dans le future",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "La date de fin doit être après la date de début",
      });
    }

    // Create reservation
    const reservation = await ReservationModel.createReservation({
      touristID,
      tourID,
      startDate,
      endDate,
      numberOfPeople,
    });

    res.status(201).json({
      success: true,
      message: "Demande de réservation envoyée avec succès",
      data: reservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);

    if (
      error.message.includes("not available") ||
      error.message.includes("not found")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.includes("cannot book your own")) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la réservation",
    });
  }
};

// Get single reservation details
export const getReservationById = async (req, res) => {
  try {
    const { reservationID } = req.params;
    const userID = req.user.userID;

    const reservation = await ReservationModel.getReservationById(
      reservationID,
      userID
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée ou accès non autorisé",
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la réservation",
    });
  }
};

// Get user's reservations (tourist or guide)
export const getUserReservations = async (req, res) => {
  try {
    const userID = req.user.userID;
    const role = req.user.role;
    const { status, page, limit } = req.query;

    const filters = { status, page, limit };
    const result = await ReservationModel.getReservationsByUser(
      userID,
      role,
      filters
    );

    res.status(200).json({
      success: true,
      data: result.reservations,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des réservations",
    });
  }
};

// Get upcoming reservations
export const getUpcomingReservations = async (req, res) => {
  try {
    const userID = req.user.userID;
    const role = req.user.role;
    const { limit = 5 } = req.query;

    const reservations = await ReservationModel.getUpcomingReservations(
      userID,
      role,
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error("Error fetching upcoming reservations:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des réservations à venir",
    });
  }
};

// Update reservation status (guide: approve/reject or propose new dates)
export const updateReservationStatus = async (req, res) => {
  try {
    const { reservationID } = req.params;
    const { status, suggestedStartDate, suggestedEndDate } = req.body;
    const guideID = req.user.userID;

    // Validate status
    const validStatuses = ["confirmed", "cancelled", "reschedule_requested"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Le statut doit être: ${validStatuses.join(", ")}`,
      });
    }

    // If proposing reschedule, dates are required
    if (status === "reschedule_requested") {
      if (!suggestedStartDate || !suggestedEndDate) {
        return res.status(400).json({
          success: false,
          message:
            "Les dates suggérées sont requises pour une demande de modification",
        });
      }

      const suggestedStart = new Date(suggestedStartDate);
      const suggestedEnd = new Date(suggestedEndDate);

      if (suggestedEnd <= suggestedStart) {
        return res.status(400).json({
          success: false,
          message: "La date de fin suggérée doit être après la date de début",
        });
      }
    }

    const suggestedDates =
      status === "reschedule_requested" &&
      suggestedStartDate &&
      suggestedEndDate
        ? { suggestedStartDate, suggestedEndDate }
        : null;

    const result = await ReservationModel.updateReservationStatus(
      reservationID,
      guideID,
      status,
      suggestedDates
    );

    let message = "";
    if (status === "confirmed") {
      message = "Réservation confirmée avec succès";
    } else if (status === "cancelled") {
      message = "Réservation refusée";
    } else if (status === "reschedule_requested") {
      message = "Nouvelles dates proposées au touriste";
    }

    res.status(200).json({
      success: true,
      message,
      data: result,
    });
  } catch (error) {
    console.error("Error updating reservation status:", error);

    if (
      error.message.includes("Unauthorized") ||
      error.message.includes("not found")
    ) {
      return res
        .status(error.message.includes("Unauthorized") ? 403 : 404)
        .json({
          success: false,
          message: error.message,
        });
    }

    if (error.message.includes("Only pending")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la réservation",
    });
  }
};

// Cancel reservation (by tourist or guide)
export const cancelReservation = async (req, res) => {
  try {
    const { reservationID } = req.params;
    const userID = req.user.userID;
    const role = req.user.role;

    await ReservationModel.cancelReservation(reservationID, userID, role);

    res.status(200).json({
      success: true,
      message: "Réservation annulée avec succès",
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée",
      });
    }

    if (
      error.message.includes("Cannot cancel") ||
      error.message.includes("cannot be cancelled")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'annulation de la réservation",
    });
  }
};

// Accept reschedule (tourist accepts guide's proposed dates)
export const acceptReschedule = async (req, res) => {
  try {
    const { reservationID } = req.params;
    const touristID = req.user.userID;

    const result = await ReservationModel.acceptReschedule(
      reservationID,
      touristID
    );

    res.status(200).json({
      success: true,
      message:
        "Nouvelles dates acceptées. La réservation est maintenant confirmée",
      data: result,
    });
  } catch (error) {
    console.error("Error accepting reschedule:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée",
      });
    }

    if (error.message.includes("Unauthorized")) {
      return res.status(403).json({
        success: false,
        message: "Non autorisé",
      });
    }

    if (
      error.message.includes("No reschedule") ||
      error.message.includes("No suggested")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'acceptation de la modification",
    });
  }
};

// Reject reschedule (tourist rejects guide's proposed dates)
export const rejectReschedule = async (req, res) => {
  try {
    const { reservationID } = req.params;
    const touristID = req.user.userID;

    const result = await ReservationModel.rejectReschedule(
      reservationID,
      touristID
    );

    res.status(200).json({
      success: true,
      message:
        "Proposition de modification rejetée. La réservation a été annulée",
      data: result,
    });
  } catch (error) {
    console.error("Error rejecting reschedule:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée",
      });
    }

    if (error.message.includes("No reschedule")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors du rejet de la modification",
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { reservationID } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Le statut de paiement est requis",
      });
    }

    await ReservationModel.updatePaymentStatus(reservationID, paymentStatus);

    res.status(200).json({
      success: true,
      message: "Statut de paiement mis à jour avec succès",
    });
  } catch (error) {
    console.error("Error updating payment status:", error);

    if (error.message.includes("Invalid payment status")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du statut de paiement",
    });
  }
};

// Mark reservation as completed (guide after tour ends)
export const markAsCompleted = async (req, res) => {
  try {
    const { reservationID } = req.params;
    const guideID = req.user.userID;

    await ReservationModel.markAsCompleted(reservationID, guideID);

    res.status(200).json({
      success: true,
      message: "Réservation marquée comme terminée",
    });
  } catch (error) {
    console.error("Error marking as completed:", error);

    if (error.message.includes("cannot be completed")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la finalisation de la réservation",
    });
  }
};

// Get guide statistics
export const getGuideStatistics = async (req, res) => {
  try {
    const guideID = req.user.userID;

    const stats = await ReservationModel.getGuideStatistics(guideID);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching guide statistics:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};

// Get tourist statistics
export const getTouristStatistics = async (req, res) => {
  try {
    const touristID = req.user.userID;

    const stats = await ReservationModel.getTouristStatistics(touristID);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching tourist statistics:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};
