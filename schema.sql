-- Create database
CREATE DATABASE IF NOT EXISTS patient_records;

-- Use the database
USE patient_records;

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    diagnosis TEXT NOT NULL,  -- This will be encrypted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('viewer', 'editor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default users
-- Password for 'viewer' is 'password' hashed with bcrypt
-- Password for 'editor' is 'password' hashed with bcrypt
INSERT INTO users (username, password_hash, role) VALUES
('viewer', '$2a$10$example.hash.for.viewer', 'viewer'),
('editor', '$2a$10$example.hash.for.editor', 'editor');