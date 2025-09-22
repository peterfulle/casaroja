// Test simple de conectividad
export const testConnection = async () => {
  try {
    console.log('Probando conectividad directa...')
    
    const response = await fetch('http://127.0.0.1:8001/api/auth/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    
    const text = await response.text()
    console.log('Response:', text)
    
    return { success: true, status: response.status, data: text }
  } catch (error: any) {
    console.error('Connection test failed:', error)
    return { success: false, error: error.message }
  }
}

// Test de registro directo
export const testRegister = async () => {
  try {
    console.log('Probando registro directo...')
    
    const userData = {
      username: `test_${Date.now()}@example.com`,
      email: `test_${Date.now()}@example.com`,
      password: 'testpass123',
      password_confirm: 'testpass123',
      first_name: 'Test',
      last_name: 'User',
      user_type: 'client',
      phone_number: ''
    }
    
    const response = await fetch('http://127.0.0.1:8001/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    
    console.log('Register Status:', response.status)
    const result = await response.json()
    console.log('Register Response:', result)
    
    return { success: response.ok, data: result }
  } catch (error: any) {
    console.error('Register test failed:', error)
    return { success: false, error: error.message }
  }
}
