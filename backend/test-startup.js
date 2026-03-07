// Quick startup test to identify runtime errors
// Run: node test-startup.js

require('dotenv').config();

console.log('🔍 Testing Backend Startup...\n');

// Test 1: Environment Variables
console.log('1️⃣ Checking Environment Variables...');
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.log('💡 Create a .env file in backend/ directory');
  process.exit(1);
} else {
  console.log('✅ All required environment variables present\n');
}

// Test 2: Node Modules
console.log('2️⃣ Checking Node Modules...');
try {
  require('express');
  require('drizzle-orm');
  require('postgres');
  require('jose');
  require('bcryptjs');
  require('zod');
  require('winston');
  console.log('✅ All required modules installed\n');
} catch (error) {
  console.error('❌ Missing node modules');
  console.log('💡 Run: npm install');
  process.exit(1);
}

// Test 3: TypeScript Compilation
console.log('3️⃣ Checking TypeScript...');
const { execSync } = require('child_process');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  console.log('✅ TypeScript compilation successful\n');
} catch (error) {
  console.error('❌ TypeScript compilation errors');
  console.log('💡 Run: npm run typecheck');
  console.log(error.stdout?.toString() || error.message);
}

// Test 4: Database Connection
console.log('4️⃣ Testing Database Connection...');
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, {
  ssl: 'require',
  max: 1,
  connect_timeout: 10,
});

sql`SELECT 1`
  .then(() => {
    console.log('✅ Database connection successful\n');
    return sql.end();
  })
  .then(() => {
    console.log('🎉 All tests passed! Ready to start server.');
    console.log('\n📝 Next steps:');
    console.log('   1. Run migrations: npm run db:push');
    console.log('   2. Start server: npm run dev');
  })
  .catch((error) => {
    console.error('❌ Database connection failed');
    console.error('Error:', error.message);
    console.log('\n💡 Check your DATABASE_URL in .env file');
    process.exit(1);
  });
