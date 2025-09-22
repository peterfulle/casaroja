import { API_CONFIG } from './api-config'

// Función de debug para probar registro directo
export const debugRegister = async (userData: any) => {
  try {
    console.log('Enviando request directo con fetch...')
    const url = `${API_CONFIG.baseURL}/auth/register/`
    console.log('URL:', url)
    console.log('Data:', userData)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const result = await response.json()
    console.log('Success response:', result)
    return result
    
  } catch (error: any) {
    console.error('Fetch error:', error)
    throw error
  }
}
