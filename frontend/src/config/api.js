// Configuración de API para diferentes entornos
const isDevelopment = import.meta.env.MODE === 'development'

// URL del backend - CAMBIA ESTO CON TU URL DE RENDER
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8000' 
  : 'https://TU-SERVICIO.onrender.com' // ⬅️ PON AQUÍ TU URL DE RENDER

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

export default {
  API_BASE_URL,
  getApiUrl
}