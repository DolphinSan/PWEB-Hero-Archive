require('dotenv').config();
const pool = require('./config/database');

async function testHeroes() {
  try {
    console.log('Testing database connection');
    
    const result = await pool.query('SELECT * FROM heroes');
    
    console.log('✅', result.rows.length, 'heroes:');
    console.log(result.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    pool.end();
  }
}

testHeroes();