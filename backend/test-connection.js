require('dotenv').config();
const postgres = require('postgres');

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

async function testConnection() {
  try {
    console.log('Testing connection...');
    console.log('URL:', process.env.DIRECT_URL ? 'Using DIRECT_URL' : 'Using DATABASE_URL');
    console.log('Connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));
    
    const sql = postgres(connectionString);
    
    console.log('✅ Connected successfully!');
    
    const result = await sql`SELECT NOW() as now`;
    console.log('✅ Query successful:', result[0]);
    
    await sql.end();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();
