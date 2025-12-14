import db from "../config/db.mjs";

// Insert reservation
export const insertReservation = async (
  touristID,
  tourID,
  startDate,
  endDate,
  amount
) => {
  const [result] = await db.query(
    `INSERT INTO toReserve
     (touristID, tourID, startDate, endDate, amount)
     VALUES (?, ?, ?, ?, ?)`,
    [touristID, tourID, startDate, endDate, amount]
  );
  return result.insertId;
};

// Get by tourist
export const getByTourist = async (touristID) => {
  const [rows] = await db.query(`SELECT * FROM toReserve WHERE touristID = ?`, [
    touristID,
  ]);
  return rows;
};

// Get for guide
export const getReservationsForGuide = async (guideID) => {
  const [rows] = await db.query(
    `SELECT r.*
     FROM toReserve r
     JOIN tours t ON r.tourID = t.tourID
     WHERE t.guideID = ?
       AND r.status IN ('pending', 'approved')
     ORDER BY r.startDate ASC`,
    [guideID]
  );
  return rows;
};

// Update status
export const updateStatus = async (reservationID, status) => {
  await db.query(`UPDATE toReserve SET status = ? WHERE reservationID = ?`, [
    status,
    reservationID,
  ]);
};

// Suggest new date
export const suggestNewDate = async (reservationID, start, end) => {
  await db.query(
    `UPDATE toReserve
     SET suggestedStartDate = ?, suggestedEndDate = ?, status = 'reschedule_requested'
     WHERE reservationID = ?`,
    [start, end, reservationID]
  );
};

// Get by ID
export const getReservationById = async (reservationID) => {
  const [rows] = await db.query(
    `SELECT r.*, t.guideID 
     FROM toReserve r
     JOIN tours t ON r.tourID = t.tourID
     WHERE r.reservationID = ?`,
    [reservationID]
  );
  return rows[0];
};

// Accept suggested date
export const acceptSuggestedDate = async (reservationID, touristID) => {
  await db.query(
    `UPDATE toReserve
     SET startDate = suggestedStartDate,
         endDate = suggestedEndDate,
         suggestedStartDate = NULL,
         suggestedEndDate = NULL,
         status = 'approved'
     WHERE reservationID = ? AND touristID = ?`,
    [reservationID, touristID]
  );
};
