import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert, Nav, Dropdown } from 'react-bootstrap'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

const API_URL = API_BASE_URL + '/api'

function UserAuth() {
  const [showModal, setShowModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
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

  useEffect(() => {
    // Cargar usuario desde sessionStorage
    const userData = sessionStorage.getItem('userData')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

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
      
      // Guardar en sessionStorage
      sessionStorage.setItem('userData', JSON.stringify(userData))
      sessionStorage.setItem('userId', userData.username)
      
      setCurrentUser(userData)
      setShowModal(false)
      setFormData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        username_or_email: ''
      })
      
      // Mostrar mensaje de éxito en lugar de recargar inmediatamente
      if (!isLogin) {
        setSuccess('¡Cuenta creada exitosamente! Redirigiendo...')
        setLoading(false)
        // Para registro exitoso, mostrar mensaje antes de recargar
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        // Para login, recargar inmediatamente
        window.location.reload()
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
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('userData')
    sessionStorage.removeItem('userId')
    
    // Actualizar estado local
    setCurrentUser(null)
    
    // Delay más largo para asegurar que el dropdown se cierre correctamente
    setTimeout(() => {
      window.location.reload()
    }, 500)
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