const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const setupSwagger = require('./swagger');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);

// Swagger
setupSwagger(app);

module.exports = app;
