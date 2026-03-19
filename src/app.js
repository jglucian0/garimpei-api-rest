require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const redirectRoutes = require('./routes/redirect.routes');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests', message: 'Muitas requisições vindas deste IP.' }
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key']
  })
);

app.use('/api/v1', limiter, routes);

app.use('/s', redirectRoutes);

app.get('/', (req, res) => res.status(200).json({ message: 'Garimpei API Online' }));

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server online' });
});

module.exports = app;
