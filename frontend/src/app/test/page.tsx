'use client'

import { useState } from 'react'
import { testConnection, testRegister } from '@/utils/connection-test'

export default function TestPage() {
  const [results, setResults] = useState<any[]>([])

  const addResult = (result: any) => {
    setResults(prev => [...prev, { ...result, timestamp: new Date().toLocaleTimeString() }])
  }

  const handleTestConnection = async () => {
    const result = await testConnection()
    addResult({ type: 'Connection Test', ...result })
  }

  const handleTestRegister = async () => {
    const result = await testRegister()
    addResult({ type: 'Register Test', ...result })
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Connection Test Page</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={handleTestConnection}
          style={{ 
            padding: '0.5rem 1rem', 
            background: '#dc2626', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Test Connection
        </button>
        
        <button 
          onClick={handleTestRegister}
          style={{ 
            padding: '0.5rem 1rem', 
            background: '#16a34a', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Test Register
        </button>
      </div>

      <div>
        <h2>Results:</h2>
        {results.map((result, index) => (
          <div 
            key={index} 
            style={{ 
              margin: '1rem 0', 
              padding: '1rem', 
              background: result.success ? '#f0fdf4' : '#fef2f2',
              border: result.success ? '1px solid #16a34a' : '1px solid #dc2626',
              borderRadius: '0.5rem'
            }}
          >
            <h3>{result.type} - {result.timestamp}</h3>
            <p><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</p>
            {result.status && <p><strong>Status:</strong> {result.status}</p>}
            {result.error && <p><strong>Error:</strong> {result.error}</p>}
            {result.data && (
              <details>
                <summary>Response Data</summary>
                <pre style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '0.25rem', overflow: 'auto' }}>
                  {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
