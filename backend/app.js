const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/users');
const reservationRoutes = require('./routes/reservationRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);

const PORT = process.env.PORT || 5000; // use 5000 by default
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

