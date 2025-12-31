import db from "../config/db.mjs";

// Find user by email
export const findUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
  return rows[0];
};

// Find user by ID
export const findUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT userID, firstName, lastName, email, photoURL, phoneNumber, role, verifiedStatus, createdAt,
            price_halfDay, price_fullDay, price_extraHour, biography
     FROM Users WHERE userID = ?`,
    [id]
  );
  return rows[0];
};

// Insert new user
export const insertUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    hashedPassword,
    photoURL,
    phoneNumber,
    role,
    verifiedStatus,
    price_halfDay,
    price_fullDay,
    price_extraHour,
    biography,
  } = userData;

  const sql = `
    INSERT INTO Users
    (firstName, lastName, email, password, photoURL, phoneNumber, role, verifiedStatus,
     price_halfDay, price_fullDay, price_extraHour, biography)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(sql, [
    firstName,
    lastName,
    email,
    hashedPassword,
    photoURL || null,
    phoneNumber || null,
    role,
    verifiedStatus,
    price_halfDay || null,
    price_fullDay || null,
    price_extraHour || null,
    biography || null,
  ]);

  return result.insertId;
};

// Update user profile
export const updateUserById = async (id, data) => {
  const {
    firstName,
    lastName,
    email,
    photoURL,
    phoneNumber,
    price_halfDay,
    price_fullDay,
    price_extraHour,
    biography,
  } = data;
  const sql = `
    UPDATE Users SET
      firstName = ?,
      lastName = ?,
      email = ?,
      photoURL = ?,
      phoneNumber = ?,
      price_halfDay = ?,
      price_fullDay = ?,
      price_extraHour = ?,
      biography = ?
    WHERE userID = ?
  `;
  const [result] = await db.query(sql, [
    firstName,
    lastName,
    email,
    photoURL || null,
    phoneNumber || null,
    price_halfDay || null,
    price_fullDay || null,
    price_extraHour || null,
    biography || null,
    id,
  ]);
  return result;
};

//delete user by id
export const deleteUserById = async (id) => {
  const [result] = await db.query(`DELETE FROM Users WHERE userID = ?`, [id]);
  return result;
};
