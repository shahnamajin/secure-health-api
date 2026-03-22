const request = require('supertest');
const express = require('express');
const patientRoutes = require('../routes/patients');
const { sequelize } = require('../config/database');
const Patient = require('../models/Patient');

// Mock auth middleware
jest.mock('../middleware/auth', () => ({
  authenticateToken: (req, res, next) => {
    req.user = { id: 1, username: 'testuser', role: 'editor' }; // Mock authenticated user
    next();
  },
  authorizeRole: (role) => (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  },
}));

const app = express();
app.use(express.json());
app.use('/patients', patientRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset DB for tests
});

afterAll(async () => {
  await sequelize.close();
});

describe('Patient API', () => {
  test('POST /patients - should create a patient', async () => {
    const response = await request(app)
      .post('/patients')
      .send({
        name: 'John Doe',
        age: 30,
        diagnosis: 'Common cold',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
    expect(response.body.age).toBe(30);
    expect(response.body.diagnosis).toBe('Common cold');
  });

  test('GET /patients/:id - should fetch a single patient', async () => {
    // First create a patient
    const createResponse = await request(app)
      .post('/patients')
      .send({
        name: 'Jane Doe',
        age: 25,
        diagnosis: 'Flu',
      });

    const patientId = createResponse.body.id;

    const response = await request(app)
      .get(`/patients/${patientId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(patientId);
    expect(response.body.name).toBe('Jane Doe');
    expect(response.body.diagnosis).toBe('Flu');
  });

  test('GET /patients - should fetch all patients', async () => {
    const response = await request(app)
      .get('/patients');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});