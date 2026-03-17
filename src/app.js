require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const routes = require('./routes');
const redirectRoutes = require('./routes/redirect.routes');

app.use(express.json());
app.use(cors());

app.use('/api/v1', routes);

app.use('/s', redirectRoutes);


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server online' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server online' });
});

module.exports = app;