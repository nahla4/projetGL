import { verifyToken } from "../utils/jwt.mjs";
import { findUserById } from "../models/user.mjs";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Non autorisé, aucun token." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Utilisateur introuvable." });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Le rôle '${req.user.role}' n'est pas autorisé.`,
      });
    }
    next();
  };
};

export const authorizeGuide = authorize("guide");
export const authorizeTourist = authorize("tourist");

export const checkVerified = (req, res, next) => {
  if (req.user.verifiedStatus !== "verified") {
    return res.status(403).json({
      error: "Votre compte n'est pas encore vérifié.",
      verifiedStatus: req.user.verifiedStatus,
    });
  }
  next();
};
