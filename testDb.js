const pool = require('./Database/db');

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful!');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();
