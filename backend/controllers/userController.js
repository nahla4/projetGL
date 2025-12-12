const User = require('../models/User');

// Example controller function
const getUsers = (req, res) => {
  User.findAll((err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(results);
  });
};

module.exports = { getUsers };
