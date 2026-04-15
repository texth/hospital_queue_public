require('dotenv').config();
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_DATABASE = process.env.DB_DATABASE || 'hq_backend';

async function createConnection(useDatabase = false) {
  const config = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  };
  if (useDatabase) {
    config.database = DB_DATABASE;
  }
  return mysql.createConnection(config);
}

async function ensureSchema(connection) {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\``);
  await connection.query(`USE \`${DB_DATABASE}\``);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255),
      email_code VARCHAR(255),
      reset_code VARCHAR(255)
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      doctor_picture VARCHAR(255)
    );
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS slots (
      id INT AUTO_INCREMENT PRIMARY KEY,
      doctor_id INT NOT NULL,
      user_id INT,
      time TEXT,
      FOREIGN KEY (doctor_id) REFERENCES doctors(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
}

async function insertDoctors(connection) {
  const [countRows] = await connection.query('SELECT COUNT(*) AS count FROM doctors');
  const existing = countRows[0].count;
  if (existing > 0) {
    console.log(`Doctors table already has ${existing} row(s); skipping doctor seed.`);
    return;
  }

  const doctors = [
    ['Dr. Alice Walker', 'General practitioner with 10 years experience in family medicine.', '1'],
    ['Dr. Brandon Lee', 'Cardiologist focused on preventative care and patient education.', '2'],
    ['Dr. Carmen Ortiz', 'Pediatrician who believes in gentle, evidence-based child care.', '3'],
    ['Dr. David Novan', 'Dermatologist specializing in skin health and cosmetic treatments.', '4'],
    ['Dr. Emma Rossi', 'Endocrinologist helping patients manage diabetes and thyroid conditions.', '5'],
  ];

  await connection.query(
    'INSERT INTO doctors (full_name, description, doctor_picture) VALUES ?;',
    [doctors]
  );
  console.log(`Inserted ${doctors.length} doctors.`);
}

async function insertSlots(connection) {
  const [countRows] = await connection.query('SELECT COUNT(*) AS count FROM slots');
  const existing = countRows[0].count;
  if (existing > 0) {
    console.log(`Slots table already has ${existing} row(s); skipping slot seed.`);
    return;
  }

  const [doctorRows] = await connection.query('SELECT id FROM doctors ORDER BY id');
  if (doctorRows.length === 0) {
    throw new Error('No doctors found when creating slots. Seed doctors first.');
  }

  const slotTimes = [
    '2026-04-14 09:00',
    '2026-04-14 10:00',
    '2026-04-14 11:00',
    '2026-04-14 14:00',
    '2026-04-14 15:00',
  ];

  const slots = [];
  for (const doctor of doctorRows) {
    for (const time of slotTimes) {
      slots.push([doctor.id, null, time]);
    }
  }

  await connection.query(
    'INSERT INTO slots (doctor_id, user_id, time) VALUES ?;',
    [slots]
  );
  console.log(`Inserted ${slots.length} slots for ${doctorRows.length} doctors.`);
}

async function main() {
  const connection = await createConnection(false);
  try {
    await ensureSchema(connection);
    await insertDoctors(connection);
    await insertSlots(connection);
    console.log('Setup complete. Fake doctors and slots are ready.');
  } finally {
    await connection.end();
  }
}

main().catch((err) => {
  console.error('Setup failed:', err.message || err);
  process.exit(1);
});