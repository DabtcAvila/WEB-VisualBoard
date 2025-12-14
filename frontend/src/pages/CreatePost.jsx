import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Card, Alert, ButtonGroup, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { postsAPI } from '../services/api'
import { cache } from '../utils/cache'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'

function CreatePost() {
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [imageMode, setImageMode] = useState('url') // 'url' o 'upload'
  const [previewUrl, setPreviewUrl] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    tags: '',
    image_file: null
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para crear un post')
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Actualizar preview si es URL
    if (name === 'image_url' && imageMode === 'url') {
      setPreviewUrl(value)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Tipo de archivo no válido. Solo se permiten: JPG, PNG, GIF, WebP')
        return
      }
      
      // Validar tamaño (máx 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 10MB')
        return
      }
      
      setFormData(prev => ({
        ...prev,
        image_file: file
      }))
      
      // Crear preview local
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      setUploading(true)
      const response = await axios.post(`${API_BASE_URL}/api/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data.image_url
    } catch (error) {
      console.error('Error al subir imagen:', error)
      throw new Error('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    let finalImageUrl = ''
    
    // Validar según el modo
    if (imageMode === 'url') {
      if (!formData.image_url) {
        setError('La URL de la imagen es requerida')
        return
      }
      finalImageUrl = formData.image_url
    } else {
      if (!formData.image_file) {
        setError('Debes seleccionar una imagen')
        return
      }
    }
    
    if (!formData.title) {
      setError('El título es requerido')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Si es modo upload, primero subir la imagen
      if (imageMode === 'upload' && formData.image_file) {
        finalImageUrl = await uploadImage(formData.image_file)
      }
      
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : []
      
      await postsAPI.create({
        title: formData.title,
        description: formData.description,
        image_url: finalImageUrl,
        tags
      })
      
      cache.clear() // Limpiar caché para mostrar el nuevo post
      alert('¡Post creado exitosamente!')
      navigate('/my-posts')
    } catch (error) {
      console.error('Error al crear post:', error)
      setError('Error al crear el post. ' + (error.message || 'Inténtalo de nuevo.'))
    } finally {
      setLoading(false)
    }
  }

  const handleModeChange = (mode) => {
    setImageMode(mode)
    setPreviewUrl('')
    setFormData(prev => ({
      ...prev,
      image_url: '',
      image_file: null
    }))
    setError(null)
  }

  return (
    <Container className="py-4">
      <Card className="mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <h2 className="mb-4">Crear Nuevo Post</h2>
          
          {currentUser && (
            <Alert variant="info" className="mb-3">
              Publicando como: <strong>{currentUser}</strong>
            </Alert>
          )}
          
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Atardecer en la playa"
                required
                maxLength={200}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen *</Form.Label>
              <ButtonGroup className="d-block mb-3">
                <Button
                  variant={imageMode === 'url' ? 'primary' : 'outline-primary'}
                  onClick={() => handleModeChange('url')}
                  size="sm"
                >
                  📎 URL de Internet
                </Button>
                <Button
                  variant={imageMode === 'upload' ? 'primary' : 'outline-primary'}
                  onClick={() => handleModeChange('upload')}
                  size="sm"
                >
                  📁 Subir Archivo
                </Button>
              </ButtonGroup>

              {imageMode === 'url' ? (
                <Form.Control
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              ) : (
                <>
                  <Form.Control
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Formatos permitidos: JPG, PNG, GIF, WebP. Máximo 10MB
                  </Form.Text>
                </>
              )}
            </Form.Group>

            {previewUrl && (
              <div className="mb-3">
                <Form.Label>Vista previa:</Form.Label>
                <div className="border rounded p-2">
                  <img 
                    src={previewUrl} 
                    alt="Vista previa"
                    className="w-100"
                    style={{ maxHeight: '300px', objectFit: 'contain' }}
                    onError={(e) => {
                      if (imageMode === 'url') {
                        e.target.style.display = 'none'
                        setError('No se pudo cargar la imagen. Verifica la URL.')
                      }
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block'
                      if (imageMode === 'url') {
                        setError(null)
                      }
                    }}
                  />
                </div>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu imagen..."
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Etiquetas</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="naturaleza, playa, atardecer"
              />
              <Form.Text className="text-muted">
                Separa las etiquetas con comas
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading || uploading}
                size="lg"
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Subiendo imagen...
                  </>
                ) : loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Creando post...
                  </>
                ) : (
                  'Crear Post'
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
                disabled={loading || uploading}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default CreatePost