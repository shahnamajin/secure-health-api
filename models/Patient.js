const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { encrypt, decrypt } = require('../utils/encryption');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false,
    // Encrypt before saving
    set(value) {
      this.setDataValue('diagnosis', encrypt(value));
    },
    // Decrypt when retrieving
    get() {
      const rawValue = this.getDataValue('diagnosis');
      return rawValue ? decrypt(rawValue) : null;
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'patients',
  timestamps: false, // We have created_at manually
});

module.exports = Patient;