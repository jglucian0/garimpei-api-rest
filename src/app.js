require('dotenv').config();

const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Servidor online' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server online' });
});

module.exports = app;