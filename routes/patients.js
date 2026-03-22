const express = require('express');
const Patient = require('../models/Patient');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// POST /patients - Create patient (editor only)
router.post('/', authenticateToken, authorizeRole('editor'), async (req, res) => {
  try {
    const { name, age, diagnosis } = req.body;

    if (!name || !age || !diagnosis) {
      return res.status(400).json({ error: 'Name, age, and diagnosis are required' });
    }

    const patient = await Patient.create({ name, age, diagnosis });
    res.status(201).json({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      diagnosis: patient.diagnosis, // Will be decrypted by getter
      created_at: patient.created_at,
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /patients/:id - Get single patient (viewer and editor)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      diagnosis: patient.diagnosis, // Decrypted
      created_at: patient.created_at,
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /patients - Get all patients (viewer and editor)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const patients = await Patient.findAll({
      order: [['created_at', 'DESC']],
    });

    const result = patients.map(patient => ({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      diagnosis: patient.diagnosis, // Decrypted
      created_at: patient.created_at,
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;