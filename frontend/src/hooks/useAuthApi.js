import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export const useAuthApi = () => {
  const { getUserId, isAuthenticated } = useAuth()

  const createAuthHeaders = () => {
    const userId = getUserId()
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (userId) {
      headers['X-User-Id'] = userId
    } else {
      headers['X-User-Id'] = 'anonymous'
    }
    
    return { headers }
  }

  const createFormDataHeaders = () => {
    const userId = getUserId()
    const headers = {}
    
    if (userId) {
      headers['X-User-Id'] = userId
    } else {
      headers['X-User-Id'] = 'anonymous'
    }
    
    return { headers }
  }

  return {
    getUserId,
    isAuthenticated,
    createAuthHeaders,
    createFormDataHeaders
  }
}

export default useAuthApi