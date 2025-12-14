import React, { useState } from 'react'
import { Modal, Form, Button, Alert, Dropdown } from 'react-bootstrap'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../config/api'

const API_URL = API_BASE_URL + '/api'

function UserAuth() {
  const { currentUser, login, logout, loading: authLoading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    username_or_email: ''
  })

  // Si el contexto está cargando, mostrar loading
  if (authLoading) {
    return (
      <Button variant="outline-light" size="sm" disabled>
        Cargando...
      </Button>
    )
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      let response
      if (isLogin) {
        // Login
        response = await axios.post(`${API_URL}/users/login`, {
          username_or_email: formData.username_or_email,
          password: formData.password
        })
      } else {
        // Registro
        response = await axios.post(`${API_URL}/users/register`, {
          username: formData.username,
          email: formData.email,
          full_name: formData.full_name,
          password: formData.password
        })
      }

      const userData = response.data
      
      // Usar el contexto para manejar el login
      const success = login(userData)
      
      if (success) {
        // Limpiar formulario
        setFormData({
          username: '',
          email: '',
          full_name: '',
          password: '',
          username_or_email: ''
        })
        
        // Mostrar mensaje de éxito
        if (isLogin) {
          setSuccess('¡Inicio de sesión exitoso!')
        } else {
          setSuccess('¡Cuenta creada exitosamente!')
        }
        
        // Cerrar modal después de un breve delay
        setTimeout(() => {
          setShowModal(false)
          setSuccess('')
        }, 1000)
      } else {
        setError('Error al procesar los datos del usuario')
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Error al procesar la solicitud')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = (e) => {
    // Prevenir propagación del evento para evitar problemas con el dropdown
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Usar el contexto para manejar el logout (sin recargas de página)
    logout()
  }

  const checkUsernameAvailability = async (username) => {
    if (username.length < 3) return
    
    try {
      const response = await axios.get(`${API_URL}/users/check/${username}`)
      if (!response.data.available) {
        setError('Este nombre de usuario ya está en uso')
      } else {
        setError('')
      }
    } catch (err) {
      console.error('Error checking username:', err)
    }
  }

  if (currentUser) {
    return (
      <Dropdown align="end">
        <Dropdown.Toggle variant="outline-light" size="sm">
          👤 {currentUser.username}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item disabled>
            <small className="text-muted">{currentUser.email}</small>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleLogout}>
            Cerrar Sesión
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  return (
    <>
      <Button 
        variant="outline-light" 
        size="sm"
        onClick={() => setShowModal(true)}
      >
        Iniciar Sesión
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {success}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            {isLogin ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario o Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="username_or_email"
                    value={formData.username_or_email}
                    onChange={handleInputChange}
                    required
                    placeholder="usuario@ejemplo.com"
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={(e) => checkUsernameAvailability(e.target.value)}
                    required
                    minLength={3}
                    maxLength={50}
                    placeholder="usuario123"
                  />
                  <Form.Text className="text-muted">
                    Será tu identificador único en la plataforma
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="usuario@ejemplo.com"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nombre Completo</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                  />
                </Form.Group>
              </>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                placeholder="••••••"
              />
              {!isLogin && (
                <Form.Text className="text-muted">
                  Mínimo 6 caracteres
                </Form.Text>
              )}
            </Form.Group>

            <div className="d-grid">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
              </Button>
            </div>
          </Form>

          <div className="text-center mt-3">
            <small>
              {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <Button 
                variant="link" 
                size="sm" 
                className="p-0"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setSuccess('')
                  setFormData({
                    username: '',
                    email: '',
                    full_name: '',
                    password: '',
                    username_or_email: ''
                  })
                }}
              >
                {isLogin ? 'Crear una' : 'Iniciar sesión'}
              </Button>
            </small>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default UserAuth