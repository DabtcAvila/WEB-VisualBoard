import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar usuario desde sessionStorage al inicializar
    const loadUserFromStorage = () => {
      try {
        const userData = sessionStorage.getItem('userData')
        if (userData) {
          const user = JSON.parse(userData)
          setCurrentUser(user)
        }
      } catch (error) {
        console.error('Error loading user from storage:', error)
        // Limpiar datos corruptos
        sessionStorage.removeItem('userData')
        sessionStorage.removeItem('userId')
      } finally {
        setLoading(false)
      }
    }

    loadUserFromStorage()
  }, [])

  const login = (userData) => {
    try {
      // Guardar en sessionStorage
      sessionStorage.setItem('userData', JSON.stringify(userData))
      sessionStorage.setItem('userId', userData.username)
      
      // Actualizar estado
      setCurrentUser(userData)
      
      return true
    } catch (error) {
      console.error('Error saving user data:', error)
      return false
    }
  }

  const logout = () => {
    try {
      // Limpiar sessionStorage
      sessionStorage.removeItem('userData')
      sessionStorage.removeItem('userId')
      
      // Actualizar estado
      setCurrentUser(null)
      
      return true
    } catch (error) {
      console.error('Error during logout:', error)
      return false
    }
  }

  const isAuthenticated = () => {
    return !!currentUser
  }

  const getUserId = () => {
    return currentUser?.username || null
  }

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    getUserId,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext