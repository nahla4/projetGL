const express = require('express');
const { getUsers } = require('../controllers/userController');
const router = express.Router();

// Define routes
router.get('/', getUsers);

module.exports = router;
