import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local FIRST
config({ path: resolve(process.cwd(), '.env.local') })

import { usersService } from '../lib/services/users.service'

async function testAuth() {
  console.log('🧪 Testing Authentication...\n')

  try {
    // Test 1: Get user by email
    console.log('Test 1: Get user by email')
    const user = await usersService.getByEmail('admin@ghumophiroindia.com')
    if (user) {
      console.log('✅ User found:', user.email, '| Role:', user.role)
    } else {
      console.log('❌ User not found')
      return
    }

    // Test 2: Verify password
    console.log('\nTest 2: Verify password')
    const verifiedUser = await usersService.verifyPassword('admin@ghumophiroindia.com', 'admin123')
    if (verifiedUser) {
      console.log('✅ Password verified for:', verifiedUser.email)
    } else {
      console.log('❌ Password verification failed')
      return
    }

    // Test 3: Try wrong password
    console.log('\nTest 3: Try wrong password')
    const wrongPassword = await usersService.verifyPassword('admin@ghumophiroindia.com', 'wrongpassword')
    if (!wrongPassword) {
      console.log('✅ Correctly rejected wrong password')
    } else {
      console.log('❌ Should have rejected wrong password')
    }

    // Test 4: Get all users
    console.log('\nTest 4: Get all users')
    const allUsers = await usersService.getAll(1, 10)
    console.log('✅ Total users:', allUsers.total)
    allUsers.users.forEach(u => {
      console.log('  -', u.email, '|', u.role)
    })

    console.log('\n🎉 All tests passed!')
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    console.error('Error details:', error)
  }
}

testAuth()
  .catch(console.error)
  .finally(() => process.exit(0))
