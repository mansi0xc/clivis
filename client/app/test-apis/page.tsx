'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message?: string
  data?: any
}

export default function TestAPIsPage() {
  const { data: session, status } = useSession()
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTest = async (testName: string, testFn: () => Promise<any>): Promise<TestResult> => {
    try {
      const result = await testFn()
      return {
        name: testName,
        status: 'success',
        data: result
      }
    } catch (error) {
      return {
        name: testName,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    const tests: TestResult[] = []

    // Test 1: Check authentication
    tests.push(await runTest('Authentication Check', async () => {
      if (!session?.user) {
        throw new Error('Not authenticated')
      }
      return { user: session.user }
    }))

    // Test 2: Get current user
    tests.push(await runTest('Get Current User', async () => {
      return await apiClient.getCurrentUser()
    }))

    // Test 3: Get societies
    tests.push(await runTest('Get Societies', async () => {
      return await apiClient.getSocieties()
    }))

    // Test 4: Create society
    tests.push(await runTest('Create Society', async () => {
      return await apiClient.createSociety({
        name: `Test Society ${Date.now()}`,
        description: 'A test society for API testing'
      })
    }))

    // Test 5: Get society details (if we have a society)
    const createSocietyResult = tests.find(t => t.name === 'Create Society')
    if (createSocietyResult?.status === 'success' && createSocietyResult.data?.society) {
      tests.push(await runTest('Get Society Details', async () => {
        return await apiClient.getSociety(createSocietyResult.data.society.id)
      }))

      // Test 6: Get society members
      tests.push(await runTest('Get Society Members', async () => {
        return await apiClient.getSocietyMembers(createSocietyResult.data.society.id)
      }))

      // Test 7: Update society
      tests.push(await runTest('Update Society', async () => {
        return await apiClient.updateSociety(createSocietyResult.data.society.id, {
          description: 'Updated description for testing'
        })
      }))
    }

    setTestResults(tests)
    setIsRunning(false)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please sign in to test the APIs</p>
          <a
            href="/auth/signin"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">API Testing Dashboard</h1>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Signed in as: <span className="font-semibold">{session.user?.name}</span></p>
                <p className="text-sm text-gray-600">Email: <span className="font-semibold">{session.user?.email}</span></p>
              </div>
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : result.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        result.status === 'success'
                          ? 'bg-green-500'
                          : result.status === 'error'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                      }`}
                    />
                    <h3 className="font-semibold text-gray-900">{result.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.status === 'success'
                        ? 'bg-green-100 text-green-800'
                        : result.status === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </div>
                
                {result.message && (
                  <p className="mt-2 text-sm text-red-600">{result.message}</p>
                )}
                
                {result.data && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                      View Response Data
                    </summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>

          {testResults.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Test Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Total Tests:</span> {testResults.length}
                </div>
                <div>
                  <span className="font-medium">Passed:</span>{' '}
                  <span className="text-green-600">
                    {testResults.filter(r => r.status === 'success').length}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Failed:</span>{' '}
                  <span className="text-red-600">
                    {testResults.filter(r => r.status === 'error').length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 