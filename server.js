const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { connectDB } = require('./config/database');
const patientRoutes = require('./routes/patients');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8443;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Secure Patient Records API is running' });
});

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('./certs/server.key'),
  cert: fs.readFileSync('./certs/server.crt'),
};

// Start server
const startServer = async () => {
  await connectDB();

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Secure Patient Records API running on https://localhost:${PORT}`);
  });
};

startServer().catch(console.error);