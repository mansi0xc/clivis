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

    // Test 6: Create outing
    console.log('\n6. Testing createOuting...')
    const newOuting = await apiClient.createOuting(newSociety.society.id, {
      title: 'Test Outing',
      description: 'A test outing for API testing',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      location: 'Test Location',
      budget: 1000
    })
    console.log('✅ Created outing:', newOuting.outing.title)

    // Test 7: Get society outings
    console.log('\n7. Testing getSocietyOutings...')
    const outings = await apiClient.getSocietyOutings(newSociety.society.id)
    console.log('✅ Found outings:', outings.outings.length)

    // Test 8: Get outing details
    console.log('\n8. Testing getOuting...')
    const outing = await apiClient.getOuting(newSociety.society.id, newOuting.outing.id)
    console.log('✅ Outing details:', outing.outing.title)

    // Test 9: Get outing participants
    console.log('\n9. Testing getOutingParticipants...')
    const participants = await apiClient.getOutingParticipants(newSociety.society.id, newOuting.outing.id)
    console.log('✅ Outing participants:', participants.participants.length)

    // Test 10: Get outing instances
    console.log('\n10. Testing getOutingInstances...')
    const instances = await apiClient.getOutingInstances(newSociety.society.id, newOuting.outing.id)
    console.log('✅ Outing instances:', instances.instances.length)

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