// routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db'); // <- import your db pool/connection [web:7][web:30]

// POST /api/users/register (inscription touriste ou guide)
router.post('/register', async (req, res) => {
  console.log('ROUTE POST /api/users/register appelée !');

  const {
    firstName,
    lastName,
    email,
    password,
    photoURL,
    phoneNumber,
    role // 'tourist' ou 'guide'
  } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  if (!['tourist', 'guide'].includes(role)) {
    return res.status(400).json({ error: 'Role invalide. Utilisez tourist ou guide.' });
  }

  try {
    // Vérifier si l'email existe déjà
    const checkSql = 'SELECT * FROM Users WHERE email = ?';
    db.query(checkSql, [email], async (err, rows) => {
      if (err) return res.status(500).json({ error: 'Erreur base de données.' });
      if (rows.length > 0) {
        return res.status(409).json({ error: 'Email déjà utilisé.' });
      }

      try {
        const hash = await bcrypt.hash(password, 10); // async API recommandé [web:45][web:50]

        const insertSql = `
          INSERT INTO Users 
          (firstName, lastName, email, password, photoURL, phoneNumber, role, verifiedStatus) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          firstName,
          lastName,
          email,
          hash,
          photoURL || null,
          phoneNumber || null,
          role,
          'pending' // statut initial
        ];

        db.query(insertSql, values, (err2, result) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: {
              userID: result.insertId,
              firstName,
              lastName,
              email,
              role,
              verifiedStatus: 'pending'
            }
          });
        });
      } catch (hashError) {
        console.error(hashError);
        return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe.' });
      }
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// POST /api/users/login (connexion touriste ou guide)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Email et mot de passe obligatoires.' });
  }

  const sql = 'SELECT * FROM Users WHERE email = ?';
  db.query(sql, [email], async (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erreur base de données.' });
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: 'Email ou mot de passe incorrect.' });
    }

    const user = rows[0];

    try {
      const match = await bcrypt.compare(password, user.password); // async compare [web:45][web:47]
      if (!match) {
        return res
          .status(401)
          .json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Ici tu peux générer un JWT si tu veux
      res.json({
        message: 'Connexion réussie.',
        user: {
          userID: user.userID,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          verifiedStatus: user.verifiedStatus,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber
        }
      });
    } catch (compareError) {
      console.error(compareError);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la vérification du mot de passe.' });
    }
  });
});

// PUT /api/users/:id (mise à jour profil)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, photoURL, phoneNumber } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  const sql = `
    UPDATE Users SET
      firstName = ?,
      lastName = ?,
      email = ?,
      photoURL = ?,
      phoneNumber = ?
    WHERE userID = ?
  `;
  const values = [firstName, lastName, email, photoURL || null, phoneNumber || null, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }
    res.json({ message: 'Profil mis à jour avec succès.' });
  });
});

// GET /api/users/:id (récupérer profil)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT userID, firstName, lastName, email, photoURL, phoneNumber, role, verifiedStatus, createdAt
    FROM Users
    WHERE userID = ?
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }
    res.json(rows[0]);
  });
});

module.exports = router;
