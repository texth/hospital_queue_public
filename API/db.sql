CREATE DATABASE IF NOT EXISTS hq_backend;
DROP USER IF EXISTS 'admin'@'localhost';
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON hq_backend.* TO 'admin'@'localhost';
USE hq_backend;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email_code VARCHAR(255),
    reset_code VARCHAR(255)
);

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    doctor_picture VARCHAR(255)
);

CREATE TABLE slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT NOT NULL,
    -- user is not required, as the slot can be available
    user_id INT,
    time TEXT,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);