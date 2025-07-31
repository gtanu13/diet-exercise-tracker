import db from './db';

async function testConnection() {
  try {
    const result = await db.selectFrom('food_items').selectAll().limit(1).execute();
    console.log('✅ Connected to DB! Sample row:', result[0] || 'No data yet.');
  } catch (err) {
    console.error('❌ DB Connection error:', err);
  } finally {
    await db.destroy(); // Always close the connection when done
  }
}

testConnection();