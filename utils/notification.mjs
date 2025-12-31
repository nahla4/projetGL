import db from "../config/db.mjs";

// Create a notification
export const createNotification = async (
  userID,
  title,
  message,
  type,
  relatedID = null,
  relatedType = null,
  conn = null
) => {
  const query = `
    INSERT INTO notifications (userID, type, title, message, relatedID, relatedType)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const dbConnection = conn || db;

  try {
    const [result] = await dbConnection.execute(query, [
      userID,
      type,
      title,
      message,
      relatedID,
      relatedType,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

// Notification types
export const NotificationType = {
  RESERVATION_NEW: "reservation_new",
  RESERVATION_CONFIRMED: "reservation_confirmed",
  RESERVATION_REJECTED: "reservation_rejected",
  RESERVATION_CANCELLED: "reservation_cancelled",
  RESCHEDULE_REQUEST: "reschedule_request",
  RESCHEDULE_APPROVED: "reschedule_approved",
  RESCHEDULE_REJECTED: "reschedule_rejected",
  PAYMENT_RECEIVED: "payment_received",
  PAYMENT_REFUNDED: "payment_refunded",
  REVIEW_RECEIVED: "review_received",
  MESSAGE_RECEIVED: "message_received",
  TOUR_REMINDER: "tour_reminder",
};


// Send tour reminder (24h before tour)
export const sendTourReminders = async () => {
  const query = `
    SELECT 
      r.reservationID,
      r.touristID,
      r.startDate,
      t.guideID,
      t.title as tourTitle,
      tourist.firstName as touristFirstName,
      guide.firstName as guideFirstName
    FROM toReserve r
    INNER JOIN tours t ON r.tourID = t.tourID
    INNER JOIN Users tourist ON r.touristID = tourist.userID
    INNER JOIN Users guide ON t.guideID = guide.userID
    WHERE r.status = 'confirmed'
      AND r.startDate >= NOW()
      AND r.startDate <= DATE_ADD(NOW(), INTERVAL 24 HOUR)
      AND r.reminderSent = 0
  `;

  try {
    const [reservations] = await db.execute(query);

    for (const reservation of reservations) {
      // Notify tourist
      await createNotification(
        reservation.touristID,
        "Rappel de tour",
        `Votre tour "${reservation.tourTitle}" commence demain`,
        NotificationType.TOUR_REMINDER,
        reservation.reservationID,
        "reservation"
      );

      // Notify guide
      await createNotification(
        reservation.guideID,
        "Rappel de tour",
        `Vous avez un tour avec ${reservation.touristFirstName} demain`,
        NotificationType.TOUR_REMINDER,
        reservation.reservationID,
        "reservation"
      );

      // Mark reminder as sent
      await db.execute(
        "UPDATE toReserve SET reminderSent = 1 WHERE reservationID = ?",
        [reservation.reservationID]
      );
    }

    return reservations.length;
  } catch (error) {
    console.error("Error sending tour reminders:", error);
    return 0;
  }
};
