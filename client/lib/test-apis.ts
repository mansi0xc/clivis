import { apiClient } from './api-client'

// Test function to verify APIs are working
export async function testSocietyAPIs() {
  try {
    console.log('🧪 Testing Society Management APIs...')

    // Test 1: Get current user
    console.log('\n1. Testing getCurrentUser...')
    const user = await apiClient.getCurrentUser()
    console.log('✅ Current user:', user.user.name)

    // Test 2: Get societies
    console.log('\n2. Testing getSocieties...')
    const societies = await apiClient.getSocieties()
    console.log('✅ Found societies:', societies.societies.length)

    // Test 3: Create a new society
    console.log('\n3. Testing createSociety...')
    const newSociety = await apiClient.createSociety({
      name: 'Test Society',
      description: 'A test society for API testing'
    })
    console.log('✅ Created society:', newSociety.society.name)

    // Test 4: Get society details
    console.log('\n4. Testing getSociety...')
    const society = await apiClient.getSociety(newSociety.society.id)
    console.log('✅ Society details:', society.society.name)

    // Test 5: Get society members
    console.log('\n5. Testing getSocietyMembers...')
    const members = await apiClient.getSocietyMembers(newSociety.society.id)
    console.log('✅ Society members:', members.members.length)

    console.log('\n🎉 All API tests passed!')
    return true
  } catch (error) {
    console.error('❌ API test failed:', error)
    return false
  }
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - expose for testing
  (window as any).testSocietyAPIs = testSocietyAPIs
} 