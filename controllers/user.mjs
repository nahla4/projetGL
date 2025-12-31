import { findUserByEmail, findUserById, insertUser, updateUserById, deleteUserById } from "../models/user.mjs";
import { hashPassword, comparePassword } from "../utils/hash.mjs";
import { generateToken } from "../utils/jwt.mjs";
import db from "../config/db.mjs";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, photoURL, phoneNumber, role, price_halfDay, price_fullDay, price_extraHour, biography } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    if (!["tourist", "guide"].includes(role)) {
      return res.status(400).json({ error: "Role invalide. Utilisez tourist ou guide." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email déjà utilisé." });
    }

    const hashedPassword = await hashPassword(password);
    const userID = await insertUser({
      firstName, lastName, email, hashedPassword, photoURL, phoneNumber, role,
      verifiedStatus: role === "guide" ? "pending" : "verified",
      price_halfDay, price_fullDay, price_extraHour, biography
    });

     const token = generateToken(userID);

    res.status(201).json({
      message: "Utilisateur créé avec succès.",
      token,
      user: { userID, firstName, lastName, email, role, verifiedStatus: role === "guide" ? "pending" : "verified" }
    });
  } catch (err) {
    console.error('Login User Error:', err);
    res.status(500).json({ error: "Erreur serveur.", details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email et mot de passe obligatoires." });

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Email ou mot de passe incorrect." });

    const match = await comparePassword(password, user.password);
    if (!match) return res.status(401).json({ error: "Email ou mot de passe incorrect." });

     const token = generateToken(user.userID);

    res.json({
      message: "Connexion réussie.",
      token,
      user: {
        userID: user.userID,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        verifiedStatus: user.verifiedStatus,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        price_halfDay: user.price_halfDay,
        price_fullDay: user.price_fullDay,
        price_extraHour: user.price_extraHour,
        biography: user.biography
      }
    });
  } catch (err) {
    console.error('Login User Error:', err);
    res.status(500).json({ error: "Erreur serveur.", details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// Update profile
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.email) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    const result = await updateUserById(id, data);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Utilisateur introuvable." });

    res.json({ message: "Profil mis à jour avec succès." });
  } catch (err) {
    console.error('Login User Error:', err);
    res.status(500).json({ error: "Erreur serveur.", details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userID;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Mots de passe actuels et nouveaux requis." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères." });
    }

    const user = await findUserByEmail(req.user.email);
    const match = await comparePassword(currentPassword, user.password);

    if (!match) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect." });
    }

    const hashedPassword = await hashPassword(newPassword);
    await db.query("UPDATE Users SET password = ? WHERE userID = ?", [hashedPassword, userId]);

    res.json({ message: "Mot de passe modifié avec succès." });
  } catch (err) {
    console.error('Login User Error:', err);
    res.status(500).json({ error: "Erreur serveur.", details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// Get user profile
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });
    res.json(user);
  } catch (err) {
    console.error('Login User Error:', err);
    res.status(500).json({ error: "Erreur serveur.", details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUserById(id);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Utilisateur introuvable." });
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur." });
  }};

