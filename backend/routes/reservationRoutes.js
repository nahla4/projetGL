// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const {
  calculateDurationHours,
  calculateAmount,
} = require('../utils/reservation');

// Middleware example (optional):
// assumes req.user is already set by an auth middleware mounted before these routes

// POST /api/reservations  - create reservation
router.post('/', async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'tourist') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { tourID, startDate, endDate } = req.body;
    const touristID = req.user.userID;

    if (!tourID || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const guide = {
      halfDayPrice: 5000,
      fullDayPrice: 8000,
      extraHourPrice: 1000,
    };

    const hours = calculateDurationHours(startDate, endDate);
    const amount = calculateAmount(hours, guide);

    const sql = `
      INSERT INTO toReserve
      (touristID, tourID, startDate, endDate, amount)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [touristID, tourID, startDate, endDate, amount];

    const [result] = await db.promise().query(sql, values);
    res.status(201).json({
      message: 'Reservation created',
      reservationID: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/my  - reservations for current tourist
router.get('/my', async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'tourist') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const sql = `SELECT * FROM toReserve WHERE touristID = ?`;
    const [rows] = await db.promise().query(sql, [req.user.userID]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reservations/guide  - requests for current guide
router.get('/guide', async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'guide') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const sql = `
      SELECT r.*
      FROM toReserve r
      JOIN tours t ON r.tourID = t.tourID
      WHERE t.guideID = ?
        AND r.status IN ('pending', 'approved')
      ORDER BY r.startDate ASC
    `;
    const [rows] = await db.promise().query(sql, [req.user.userID]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// helper to fetch one reservation (used by several routes)
async function fetchReservation(reservationID) {
  const sql = `
    SELECT r.*, t.guideID
    FROM toReserve r
    JOIN tours t ON r.tourID = t.tourID
    WHERE r.reservationID = ?
  `;
  const [rows] = await db.promise().query(sql, [reservationID]);
  return rows[0];
}

// POST /api/reservations/:id/approve  - guide approves reservation
router.post('/:id/approve', async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'guide') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reservation = await fetchReservation(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.guideID !== req.user.userID)
      return res.status(403).json({ message: 'Access denied' });

    const sql = `UPDATE toReserve SET status = ? WHERE reservationID = ?`;
    await db.promise().query(sql, ['approved', req.params.id]);

    res.json({ message: 'Reservation approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations/:id/propose-date  - guide proposes new date
router.post('/:id/propose-date', async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'guide') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reservation = await fetchReservation(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.guideID !== req.user.userID)
      return res.status(403).json({ message: 'Access denied' });

    const { suggestedStartDate, suggestedEndDate } = req.body;
    if (!suggestedStartDate || !suggestedEndDate) {
      return res.status(400).json({ message: 'Missing suggested dates' });
    }

    const sql = `
      UPDATE toReserve
      SET suggestedStartDate = ?, suggestedEndDate = ?, status = 'reschedule_requested'
      WHERE reservationID = ?
    `;
    await db.promise().query(sql, [
      suggestedStartDate,
      suggestedEndDate,
      req.params.id,
    ]);

    res.json({ message: 'New date proposed to the tourist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reservations/:id/accept-date  - tourist accepts proposed date
router.post('/:id/accept-date', async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'tourist') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reservation = await fetchReservation(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.touristID !== req.user.userID)
      return res.status(403).json({ message: 'Access denied' });

    const sql = `
      UPDATE toReserve
      SET startDate = suggestedStartDate,
          endDate = suggestedEndDate,
          suggestedStartDate = NULL,
          suggestedEndDate = NULL,
          status = 'approved'
      WHERE reservationID = ? AND touristID = ?
    `;
    await db.promise().query(sql, [req.params.id, req.user.userID]);

    res.json({ message: 'Suggested date accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
