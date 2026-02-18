// src/app.js
const express = require('express');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

// Σύνδεση με τη βάση δεδομένων (
connectDB();

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Το βάζουμε στο '/' ώστε το url να είναι σκέτο /signup
app.use('/', authRoutes);
app.use('/todos', todoRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;