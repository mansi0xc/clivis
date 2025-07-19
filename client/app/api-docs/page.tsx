'use client'

import { useState } from 'react'

interface Endpoint {
  method: string
  path: string
  description: string
  auth: boolean
  admin?: boolean
  body?: string
  response?: string
}

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/auth/me',
    description: 'Get current user information',
    auth: true,
    response: '{ user: { id, name, email, image } }'
  },
  {
    method: 'GET',
    path: '/api/societies',
    description: 'List all societies where user is a member',
    auth: true,
    response: '{ societies: Society[] }'
  },
  {
    method: 'POST',
    path: '/api/societies',
    description: 'Create a new society',
    auth: true,
    body: '{ name: string, description?: string }',
    response: '{ society: Society }'
  },
  {
    method: 'GET',
    path: '/api/societies/[id]',
    description: 'Get society details with members and outings',
    auth: true,
    response: '{ society: Society }'
  },
  {
    method: 'PUT',
    path: '/api/societies/[id]',
    description: 'Update society information',
    auth: true,
    admin: true,
    body: '{ name?: string, description?: string }',
    response: '{ society: Society }'
  },
  {
    method: 'DELETE',
    path: '/api/societies/[id]',
    description: 'Delete society (admin only)',
    auth: true,
    admin: true,
    response: '{ message: string }'
  },
  {
    method: 'GET',
    path: '/api/societies/[id]/members',
    description: 'List society members',
    auth: true,
    response: '{ members: SocietyMember[] }'
  },
  {
    method: 'POST',
    path: '/api/societies/[id]/members',
    description: 'Add member to society by email',
    auth: true,
    admin: true,
    body: '{ email: string, role?: "ADMIN" | "MEMBER" }',
    response: '{ member: SocietyMember }'
  },
  {
    method: 'PUT',
    path: '/api/societies/[id]/members/[userId]',
    description: 'Update member role',
    auth: true,
    admin: true,
    body: '{ role: "ADMIN" | "MEMBER" }',
    response: '{ member: SocietyMember }'
  },
  {
    method: 'DELETE',
    path: '/api/societies/[id]/members/[userId]',
    description: 'Remove member from society',
    auth: true,
    admin: true,
    response: '{ message: string }'
  }
]

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null)

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800'
      case 'POST': return 'bg-blue-100 text-blue-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">API Documentation</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication</h2>
            <p className="text-gray-600 mb-4">
              All API endpoints require authentication. Use NextAuth.js session cookies for authentication.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Base URL</h3>
              <code className="text-blue-800">http://localhost:3000/api</code>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Endpoints List */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Endpoints</h2>
              <div className="space-y-2">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedEndpoint === endpoint
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <span className="text-sm font-mono text-gray-700">{endpoint.path}</span>
                    </div>
                    <p className="text-sm text-gray-600">{endpoint.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {endpoint.auth && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Auth</span>
                      )}
                      {endpoint.admin && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Admin</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Endpoint Details */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Endpoint Details</h2>
              
              {selectedEndpoint ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`px-3 py-1 rounded font-medium ${getMethodColor(selectedEndpoint.method)}`}>
                      {selectedEndpoint.method}
                    </span>
                    <code className="text-lg font-mono text-gray-800">{selectedEndpoint.path}</code>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{selectedEndpoint.description}</p>
                  
                  <div className="space-y-4">
                    {selectedEndpoint.auth && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
                        <p className="text-sm text-gray-600">Requires valid session cookie</p>
                      </div>
                    )}
                    
                    {selectedEndpoint.admin && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Authorization</h4>
                        <p className="text-sm text-gray-600">Requires ADMIN role in the society</p>
                      </div>
                    )}
                    
                    {selectedEndpoint.body && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
                        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {selectedEndpoint.body}
                        </pre>
                      </div>
                    )}
                    
                    {selectedEndpoint.response && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
                        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                          {selectedEndpoint.response}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                  <p className="text-gray-500">Select an endpoint to view details</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Testing</h3>
            <p className="text-yellow-800 mb-2">
              You can test these APIs using the test dashboard:
            </p>
            <a
              href="/test-apis"
              className="inline-block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              Go to Test Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 