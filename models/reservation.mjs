import db from "../config/db.mjs";
import { createNotification } from "../utils/notification.mjs";
import { calculatePrice } from "../utils/priceCalculator.mjs";

// Create a new reservation
export const createReservation = async (reservationData) => {
  const { touristID, tourID, startDate, endDate, numberOfPeople } =
    reservationData;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Get tour details and guide pricing
    const [tours] = await conn.query(
      `SELECT t.*, u.userID as guideID, u.firstName as guideName, 
              u.price_halfDay, u.price_fullDay, u.price_extraHour
       FROM tours t
       INNER JOIN users u ON t.guideID = u.userID
       WHERE t.tourID = ?`,
      [tourID]
    );

    if (tours.length === 0) {
      throw new Error("Tour not found");
    }

    const tour = tours[0];

    // Verify tourist is not booking their own tour
    if (tour.guideID === touristID) {
      throw new Error("You cannot book your own tour");
    }

    // Check for conflicting reservations (guide availability)
    const [conflicts] = await conn.query(
      `SELECT reservationID FROM toReserve 
       WHERE tourID IN (SELECT tourID FROM tours WHERE guideID = ?)
       AND status IN ('confirmed', 'pending', 'reschedule_requested')
       AND (
         (startDate <= ? AND endDate >= ?)
         OR (startDate <= ? AND endDate >= ?)
         OR (startDate >= ? AND endDate <= ?)
       )`,
      [tour.guideID, startDate, startDate, endDate, endDate, startDate, endDate]
    );

    if (conflicts.length > 0) {
      throw new Error(
        "Guide is not available for these dates. Please choose different dates."
      );
    }

    // Calculate base price per person
    const basePricePerPerson = calculatePrice(tour.duration, {
      price_halfDay: tour.price_halfDay,
      price_fullDay: tour.price_fullDay,
      price_extraHour: tour.price_extraHour,
    });

    // Calculate total amount (base price × number of people)
    const totalAmount = basePricePerPerson * numberOfPeople;

    // Insert reservation
    const [result] = await conn.query(
      `INSERT INTO toReserve 
      (touristID, tourID, startDate, endDate, numberOfPeople, amount)
      VALUES (?, ?, ?, ?, ?,?)`,
      [touristID, tourID, startDate, endDate, numberOfPeople, totalAmount]
    );

    const reservationID = result.insertId;

    // Create notification for guide
    await createNotification(
      tour.guideID,
      "New Reservation Request",
      `You have a new reservation request for "${tour.title}"`,
      "new_reservation",
      reservationID,
      "reservation",
      conn
    );

    await conn.commit();

    return {
      reservationID,
      amount: totalAmount,
      basePricePerPerson,
      numberOfPeople,
      status: "pending",
      paymentStatus: "unpaid",
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Get reservation by ID
export const getReservationById = async (reservationID, userID) => {
  const [reservations] = await db.query(
    `SELECT 
      r.*,
      t.title as tourTitle,
      t.description as tourDescription,
      t.duration,
      c.name as cityName,
      t.meetingPoint,
      t.gps_latitude,
      t.gps_longitude,
      guide.firstName as guideFirstName,
      guide.lastName as guideLastName,
      guide.photoURL as guidePhoto,
      guide.phoneNumber as guidePhone,
      guide.email as guideEmail,
      guide.biography as guideBiography,
      tourist.firstName as touristFirstName,
      tourist.lastName as touristLastName,
      tourist.photoURL as touristPhoto,
      tourist.phoneNumber as touristPhone,
      tourist.email as touristEmail,
      (SELECT photoURL FROM tourphotos WHERE tourID = t.tourID LIMIT 1) as tourPhoto
    FROM toReserve r
    INNER JOIN tours t ON r.tourID = t.tourID
    LEFT JOIN cities c ON t.cityID = c.cityID
    INNER JOIN users guide ON t.guideID = guide.userID
    INNER JOIN users tourist ON r.touristID = tourist.userID
    WHERE r.reservationID = ?
    AND (r.touristID = ? OR t.guideID = ?)`,
    [reservationID, userID, userID]
  );

  return reservations.length > 0 ? reservations[0] : null;
};

// Get all reservations for a user (tourist or guide)
export const getReservationsByUser = async (userID, role, filters = {}) => {
  const { status, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  let query = `
    SELECT 
      r.*,
      t.title as tourTitle,
      c.name as cityName,
      t.duration,
      (SELECT photoURL FROM tourphotos WHERE tourID = t.tourID LIMIT 1) as tourPhoto
  `;

  if (role === "guide") {
    query += `,
      tourist.firstName as touristFirstName,
      tourist.lastName as touristLastName,
      tourist.photoURL as touristPhoto,
      tourist.phoneNumber as touristPhone
    FROM toReserve r
    INNER JOIN tours t ON r.tourID = t.tourID
    LEFT JOIN cities c ON t.cityID = c.cityID
    INNER JOIN users tourist ON r.touristID = tourist.userID
    WHERE t.guideID = ?`;
  } else {
    query += `,
      guide.firstName as guideFirstName,
      guide.lastName as guideLastName,
      guide.photoURL as guidePhoto,
      guide.phoneNumber as guidePhone
    FROM toReserve r
    INNER JOIN tours t ON r.tourID = t.tourID
    LEFT JOIN cities c ON t.cityID = c.cityID
    INNER JOIN users guide ON t.guideID = guide.userID
    WHERE r.touristID = ?`;
  }

  const params = [userID];

  if (status) {
    query += ` AND r.status = ?`;
    params.push(status);
  }

  // Get total count
  const countQuery = query.replace(
    /SELECT .+ FROM/,
    "SELECT COUNT(*) as total FROM"
  );
  const [countResult] = await db.query(countQuery, params);
  const total = countResult[0].total;

  query += ` ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const [reservations] = await db.query(query, params);

  return {
    reservations,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Update reservation status (guide approves/rejects)
export const updateReservationStatus = async (
  reservationID,
  guideID,
  newStatus,
  suggestedDates = null
) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Verify ownership
    const [reservation] = await conn.query(
      `SELECT r.*, t.guideID, t.title as tourTitle, r.touristID
       FROM toReserve r
       INNER JOIN tours t ON r.tourID = t.tourID
       WHERE r.reservationID = ?`,
      [reservationID]
    );

    if (reservation.length === 0) {
      throw new Error("Reservation not found");
    }

    if (reservation[0].guideID !== guideID) {
      throw new Error(
        "Unauthorized - You can only manage your own tour reservations"
      );
    }

    if (
      reservation[0].status !== "pending" &&
      reservation[0].status !== "reschedule_requested"
    ) {
      throw new Error(
        "Only pending or reschedule_requested reservations can be updated"
      );
    }

    // Validate status
    const validStatuses = ["confirmed", "cancelled", "reschedule_requested"];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    // Build update query
    let updateQuery = "UPDATE toReserve SET status = ?";
    const updateParams = [newStatus];

    // Add suggested dates if rescheduling
    if (newStatus === "reschedule_requested" && suggestedDates) {
      updateQuery += ", suggestedStartDate = ?, suggestedEndDate = ?";
      updateParams.push(
        suggestedDates.suggestedStartDate,
        suggestedDates.suggestedEndDate
      );
    }

    updateQuery += " WHERE reservationID = ?";
    updateParams.push(reservationID);

    await conn.query(updateQuery, updateParams);

    // Create notification for tourist
    let notificationMessage = "";
    let notificationType = "";

    if (newStatus === "confirmed") {
      notificationType = "reservation_confirmed";
      notificationMessage = `Your reservation for "${reservation[0].tourTitle}" has been confirmed!`;
    } else if (newStatus === "cancelled") {
      notificationType = "reservation_cancelled";
      notificationMessage = `Your reservation for "${reservation[0].tourTitle}" has been cancelled by the guide.`;
    } else if (newStatus === "reschedule_requested") {
      notificationType = "reschedule_requested";
      notificationMessage = `The guide has proposed new dates for "${reservation[0].tourTitle}". Please review.`;
    }

    await createNotification(
      reservation[0].touristID,
      "Reservation Update",
      notificationMessage,
      notificationType,
      reservationID,
      "reservation",
      conn
    );

    await conn.commit();
    return { success: true, status: newStatus };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Cancel reservation (by tourist or guide)
export const cancelReservation = async (reservationID, userID, role) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Get reservation details
    let query, params;
    if (role === "tourist") {
      query = `
        SELECT r.*, t.guideID, t.title as tourTitle, u.firstName as touristName
         FROM toReserve r
         INNER JOIN tours t ON r.tourID = t.tourID
         INNER JOIN users u ON r.touristID = u.userID
         WHERE r.reservationID = ? AND r.touristID = ?`;
      params = [reservationID, userID];
    } else if (role === "guide") {
      query = `
      SELECT r.*, t.title AS tourTitle, tourist.firstName AS touristName,
      guide.firstName AS guideName
        FROM toReserve r
        INNER JOIN tours t ON r.tourID = t.tourID
        INNER JOIN users tourist ON r.touristID = tourist.userID
        INNER JOIN users guide ON t.guideID = guide.userID
        WHERE r.reservationID = ? AND t.guideID = ?`;
      params = [reservationID, userID];
    } else {
      throw new Error("Invalid role");
    }

    const [reservation] = await conn.query(query, params);

    if (reservation.length === 0) {
      throw new Error("Reservation not found");
    }

    const res = reservation[0];

    // Check if can cancel based on role
    if (role === "tourist") {
      const startDate = new Date(res.startDate);
      const now = new Date();

      if (startDate <= now) {
        throw new Error("Cannot cancel reservation after start date");
      }
    }

    // Both tourists and guides can only cancel certain statuses
    if (
      !["pending", "confirmed", "reschedule_requested"].includes(res.status)
    ) {
      throw new Error("Reservation cannot be cancelled");
    }

    // Update status
    await conn.query(
      `UPDATE toReserve SET status = 'cancelled' WHERE reservationID = ?`,
      [reservationID]
    );

    // Notify the other party
    if (role === "tourist") {
      // Notify guide
      await createNotification(
        res.guideID,
        "Reservation Cancelled",
        `A tourist has cancelled their reservation for "${res.tourTitle}"`,
        "reservation_cancelled",
        reservationID,
        "reservation",
        conn
      );
    } else if (role === "guide") {
      // Notify tourist
      await createNotification(
        res.touristID,
        "Reservation Cancelled",
        `Your reservation for "${res.tourTitle}" has been cancelled by the guide`,
        "reservation_cancelled",
        reservationID,
        "reservation",
        conn
      );
    }

    await conn.commit();
    return { success: true };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Accept reschedule request (tourist accepts guide's suggested dates)
export const acceptReschedule = async (reservationID, touristID) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Get reservation with suggested dates
    const [reservation] = await conn.query(
      `SELECT r.suggestedStartDate, r.suggestedEndDate, r.status, r.touristID,
              t.guideID, t.title as tourTitle
       FROM toReserve r
       INNER JOIN tours t ON r.tourID = t.tourID
       WHERE r.reservationID = ?`,
      [reservationID]
    );

    if (reservation.length === 0) {
      throw new Error("Reservation not found");
    }

    if (reservation[0].touristID !== touristID) {
      throw new Error("Unauthorized");
    }

    if (reservation[0].status !== "reschedule_requested") {
      throw new Error("No reschedule request pending");
    }

    if (
      !reservation[0].suggestedStartDate ||
      !reservation[0].suggestedEndDate
    ) {
      throw new Error("No suggested dates available");
    }

    // Update with suggested dates and confirm
    await conn.query(
      `UPDATE toReserve 
       SET startDate = suggestedStartDate,
           endDate = suggestedEndDate,
           status = 'confirmed',
           suggestedStartDate = NULL,
           suggestedEndDate = NULL
       WHERE reservationID = ?`,
      [reservationID]
    );

    // Notify guide
    await createNotification(
      reservation[0].guideID,
      "Reschedule Accepted",
      `The tourist accepted your reschedule proposal for "${reservation[0].tourTitle}"`,
      "reschedule_accepted",
      reservationID,
      "reservation",
      conn
    );

    await conn.commit();
    return { success: true, status: "confirmed" };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Reject reschedule request (tourist rejects guide's suggested dates)
export const rejectReschedule = async (reservationID, touristID) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Get reservation details
    const [reservation] = await conn.query(
      `SELECT r.*, t.guideID, t.title as tourTitle
       FROM toReserve r
       INNER JOIN tours t ON r.tourID = t.tourID
       WHERE r.reservationID = ? AND r.touristID = ?`,
      [reservationID, touristID]
    );

    if (reservation.length === 0) {
      throw new Error("Reservation not found");
    }

    if (reservation[0].status !== "reschedule_requested") {
      throw new Error("No reschedule request pending");
    }

    // Cancel reservation
    await conn.query(
      `UPDATE toReserve 
       SET status = 'cancelled',
           suggestedStartDate = NULL,
           suggestedEndDate = NULL
       WHERE reservationID = ?`,
      [reservationID]
    );

    // Notify guide
    await createNotification(
      reservation[0].guideID,
      "Reschedule Rejected",
      `The tourist rejected your reschedule proposal for "${reservation[0].tourTitle}"`,
      "reschedule_rejected",
      reservationID,
      "reservation",
      conn
    );

    await conn.commit();
    return { success: true, status: "cancelled" };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

// Get upcoming reservations
export const getUpcomingReservations = async (userID, role, limit = 5) => {
  let query;

  if (role === "guide") {
    query = `
      SELECT 
        r.*,
        t.title as tourTitle,
        c.name as cityName,
        t.meetingPoint,
        tourist.firstName as touristFirstName,
        tourist.lastName as touristLastName,
        tourist.phoneNumber as touristPhone
      FROM toReserve r
      INNER JOIN tours t ON r.tourID = t.tourID
      LEFT JOIN cities c ON t.cityID = c.cityID
      INNER JOIN users tourist ON r.touristID = tourist.userID
      WHERE t.guideID = ?
      AND r.status = 'confirmed'
      AND r.startDate >= NOW()
      ORDER BY r.startDate ASC
      LIMIT ?`;
  } else {
    query = `
      SELECT 
        r.*,
        t.title as tourTitle,
        c.name as cityName,
        t.meetingPoint,
        guide.firstName as guideFirstName,
        guide.lastName as guideLastName,
        guide.phoneNumber as guidePhone
      FROM toReserve r
      INNER JOIN tours t ON r.tourID = t.tourID
      LEFT JOIN cities c ON t.cityID = c.cityID
      INNER JOIN users guide ON t.guideID = guide.userID
      WHERE r.touristID = ?
      AND r.status = 'confirmed'
      AND r.startDate >= NOW()
      ORDER BY r.startDate ASC
      LIMIT ?`;
  }

  const [reservations] = await db.query(query, [userID, limit]);
  return reservations;
};

// Get statistics for guide dashboard
export const getGuideStatistics = async (guideID) => {
  const [stats] = await db.query(
    `SELECT 
      COUNT(*) as totalReservations,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingCount,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmedCount,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedCount,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledCount,
      SUM(CASE WHEN status = 'reschedule_requested' THEN 1 ELSE 0 END) as rescheduleCount,
      SUM(CASE WHEN status = 'completed' AND paymentStatus = 'paid' THEN amount ELSE 0 END) as totalEarnings,
      SUM(CASE WHEN paymentStatus = 'paid' THEN amount ELSE 0 END) as totalPaid,
      SUM(CASE WHEN paymentStatus = 'unpaid' AND status = 'confirmed' THEN amount ELSE 0 END) as pendingPayments,
      AVG(CASE WHEN status IN ('confirmed', 'completed') THEN amount ELSE NULL END) as avgReservationValue,
      SUM(CASE WHEN status IN ('confirmed', 'completed') THEN numberOfPeople ELSE 0 END) as totalPeopleServed
    FROM toReserve r
    INNER JOIN tours t ON r.tourID = t.tourID
    WHERE t.guideID = ?`,
    [guideID]
  );

  return stats[0];
};

// Get statistics for tourist dashboard
export const getTouristStatistics = async (touristID) => {
  const [stats] = await db.query(
    `SELECT 
      COUNT(*) as totalReservations,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingCount,
      SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmedCount,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedCount,
      SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledCount,
      SUM(CASE WHEN paymentStatus = 'paid' THEN amount ELSE 0 END) as totalSpent,
      SUM(CASE WHEN paymentStatus = 'unpaid' AND status = 'confirmed' THEN amount ELSE 0 END) as unpaidAmount,
      SUM(numberOfPeople) as totalPeopleBooked
    FROM toReserve
    WHERE touristID = ?`,
    [touristID]
  );

  return stats[0];
};

// Update payment status
export const updatePaymentStatus = async (reservationID, paymentStatus) => {
  const validStatuses = ["paid", "unpaid", "refunded"];
  if (!validStatuses.includes(paymentStatus)) {
    throw new Error(
      `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  const [result] = await db.query(
    "UPDATE toReserve SET paymentStatus = ? WHERE reservationID = ?",
    [paymentStatus, reservationID]
  );

  if (result.affectedRows === 0) {
    throw new Error("Reservation not found");
  }

  return { success: true };
};

// Mark reservation as completed (after tour date)
export const markAsCompleted = async (reservationID, guideID) => {
  const [result] = await db.query(
    `UPDATE toReserve r
     INNER JOIN tours t ON r.tourID = t.tourID
     SET r.status = 'completed'
     WHERE r.reservationID = ?
     AND t.guideID = ?
     AND r.status = 'confirmed'
     AND r.endDate < NOW()`,
    [reservationID, guideID]
  );

  if (result.affectedRows === 0) {
    throw new Error(
      "Reservation cannot be completed (not found, unauthorized, or not yet ended)"
    );
  }

  return { success: true };
};
