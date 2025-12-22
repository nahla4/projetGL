import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import usersRouter from './routes/users.js';
import reservationRouter from './routes/reservationRoutes.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
const db = connectDB();

app.use(cors());
app.use(express.json());

// Middleware to attach db to req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/users', usersRouter);
app.use('/api/reservations', reservationRouter);

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
