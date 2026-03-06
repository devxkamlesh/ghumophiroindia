import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

async function testDatabase() {
  try {
    console.log('Testing database connection...')
    
    // Try to fetch users
    const allUsers = await db.select().from(users)
    console.log(`Found ${allUsers.length} users in database`)
    
    if (allUsers.length > 0) {
      console.log('Users:')
      allUsers.forEach(user => {
        console.log(`- ${user.email} (${user.role})`)
      })
    } else {
      console.log('No users found. Run: npm run seed')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Database test failed:', error)
    process.exit(1)
  }
}

testDatabase()
