# 🎓 Guía Completa para Examen - Proyecto Visual Board

## 📋 Funcionalidades Mínimas Requeridas

### ✅ **Frontend (React):**
- Sistema de autenticación (login/registro)
- CRUD de posts (crear, leer, editar, eliminar)
- Grid responsive de imágenes
- Navegación SPA con React Router
- Integración con API backend

### ✅ **Backend (FastAPI/Express):**
- API RESTful completa
- Autenticación de usuarios
- Base de datos (PostgreSQL/SQLite)
- CRUD de usuarios y posts
- Manejo de archivos/imágenes

---

## 📁 Estructura de Carpetas Esencial

```
proyecto-visual-board/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   ├── PostCard.jsx
│   │   │   └── AuthModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   └── MyPosts.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── post.py
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── posts.py
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
└── schema.sql
```

---

## 🚀 PASO 1: Setup del Proyecto

### **1.1 Crear Frontend (Vite + React)**
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install react-router-dom axios bootstrap
```

### **1.2 Crear Backend (FastAPI)**
```bash
mkdir backend
cd backend
pip install fastapi uvicorn sqlalchemy psycopg2 python-multipart bcrypt
pip freeze > requirements.txt
```

---

## 💻 PASO 2: Frontend Esencial

### **2.1 package.json**
```json
{
  "name": "visual-board-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "bootstrap": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0"
  }
}
```

### **2.2 main.jsx (Punto de entrada)**
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

### **2.3 AuthContext.jsx (Estado global)**
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = sessionStorage.getItem('userData')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    sessionStorage.setItem('userData', JSON.stringify(userData))
    setCurrentUser(userData)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem('userData')
    setCurrentUser(null)
    return true
  }

  const isAuthenticated = () => !!currentUser

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

### **2.4 App.jsx (Componente principal)**
```jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import MyPosts from './pages/MyPosts'

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/my-posts" element={<MyPosts />} />
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App
```

### **2.5 services/api.js (Cliente de API)**
```javascript
import axios from 'axios'

const API_BASE = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor para autenticación
api.interceptors.request.use((config) => {
  const userData = sessionStorage.getItem('userData')
  if (userData) {
    const user = JSON.parse(userData)
    config.headers['X-User-Id'] = user.username
  }
  return config
})

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

// Posts API  
export const postsAPI = {
  getAll: () => api.get('/posts'),
  getMyPosts: () => api.get('/posts/my'),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`)
}

export default api
```

### **2.6 components/Navigation.jsx**
```jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Container, Button, Modal, Form } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

function Navigation() {
  const { currentUser, login, logout, isAuthenticated } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '', email: '', password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let response
      if (isLogin) {
        response = await authAPI.login({
          username: formData.username,
          password: formData.password
        })
      } else {
        response = await authAPI.register(formData)
      }
      login(response.data)
      setShowModal(false)
      setFormData({ username: '', email: '', password: '' })
    } catch (error) {
      alert('Error: ' + (error.response?.data?.detail || 'Error de conexión'))
    }
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Visual Board</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {isAuthenticated() && (
              <>
                <Nav.Link as={Link} to="/create">Crear Post</Nav.Link>
                <Nav.Link as={Link} to="/my-posts">Mis Posts</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {isAuthenticated() ? (
              <Button variant="outline-light" onClick={logout}>
                Cerrar Sesión ({currentUser.username})
              </Button>
            ) : (
              <Button variant="outline-light" onClick={() => setShowModal(true)}>
                Iniciar Sesión
              </Button>
            )}
          </Nav>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </Form.Group>
            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Navigation
```

### **2.7 components/PostCard.jsx**
```jsx
import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { postsAPI } from '../services/api'

function PostCard({ post, onDelete }) {
  const { currentUser } = useAuth()
  const isOwner = currentUser?.username === post.user_id

  const handleDelete = async () => {
    if (window.confirm('¿Eliminar este post?')) {
      try {
        await postsAPI.delete(post.id)
        onDelete(post.id)
      } catch (error) {
        alert('Error al eliminar')
      }
    }
  }

  return (
    <Card className="mb-4">
      <Card.Img 
        variant="top" 
        src={post.image_url} 
        style={{height: '200px', objectFit: 'cover'}}
      />
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.description}</Card.Text>
        <small className="text-muted">Por: {post.user_id}</small>
        {isOwner && (
          <div className="mt-2">
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default PostCard
```

### **2.8 pages/Home.jsx**
```jsx
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import PostCard from '../components/PostCard'
import { postsAPI } from '../services/api'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await postsAPI.getAll()
      setPosts(response.data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <h1>Posts Recientes</h1>
      <Row>
        {posts.map(post => (
          <Col md={4} key={post.id}>
            <PostCard post={post} onDelete={handleDeletePost} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Home
```

### **2.9 pages/CreatePost.jsx**
```jsx
import React, { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { postsAPI } from '../services/api'

function CreatePost() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  })

  if (!isAuthenticated()) {
    return <div>Debes iniciar sesión para crear posts</div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await postsAPI.create(formData)
      alert('Post creado exitosamente')
      navigate('/')
    } catch (error) {
      alert('Error al crear post')
    }
  }

  return (
    <div>
      <h1>Crear Nuevo Post</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">Crear Post</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CreatePost
```

---

## 🔧 PASO 3: Backend Esencial (FastAPI)

### **3.1 requirements.txt**
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-multipart==0.0.6
bcrypt==4.1.2
python-jose==3.3.0
```

### **3.2 app/main.py (Punto de entrada)**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, posts

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Visual Board API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(posts.router, prefix="/posts", tags=["posts"])

@app.get("/")
def read_root():
    return {"message": "Visual Board API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### **3.3 app/database.py**
```python
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite para examen (más simple)
SQLALCHEMY_DATABASE_URL = "sqlite:///./visual_board.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency para obtener DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### **3.4 app/models/user.py**
```python
from sqlalchemy import Column, Integer, String
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
```

### **3.5 app/models/post.py**
```python
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    image_url = Column(String, nullable=False)
    user_id = Column(String, nullable=False)  # username del creador
    created_at = Column(DateTime, default=datetime.utcnow)
```

### **3.6 app/routes/auth.py**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt
from app.database import get_db
from app.models.user import User

router = APIRouter()

@router.post("/register")
def register(user_data: dict, db: Session = Depends(get_db)):
    # Verificar si usuario existe
    existing_user = db.query(User).filter(
        (User.username == user_data["username"]) | 
        (User.email == user_data["email"])
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario o email ya existe")
    
    # Hash password
    password_hash = bcrypt.hashpw(
        user_data["password"].encode('utf-8'), 
        bcrypt.gensalt()
    ).decode('utf-8')
    
    # Crear usuario
    db_user = User(
        username=user_data["username"],
        email=user_data["email"],
        password_hash=password_hash
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {
        "username": db_user.username,
        "email": db_user.email
    }

@router.post("/login")
def login(credentials: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == credentials["username"]
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    
    # Verificar password
    if not bcrypt.checkpw(
        credentials["password"].encode('utf-8'), 
        user.password_hash.encode('utf-8')
    ):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")
    
    return {
        "username": user.username,
        "email": user.email
    }
```

### **3.7 app/routes/posts.py**
```python
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.post import Post

router = APIRouter()

@router.get("/")
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    return posts

@router.get("/my")
def get_my_posts(
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    posts = db.query(Post).filter(Post.user_id == x_user_id).all()
    return posts

@router.post("/")
def create_post(
    post_data: dict,
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    db_post = Post(
        title=post_data["title"],
        description=post_data.get("description", ""),
        image_url=post_data["image_url"],
        user_id=x_user_id
    )
    
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    return db_post

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    x_user_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    if post.user_id != x_user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    db.delete(post)
    db.commit()
    
    return {"message": "Post eliminado"}
```

---

## 🗄️ PASO 4: Base de Datos

### **4.1 schema.sql (Para referencia)**
```sql
-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- Tabla de posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
```

---

## 🚀 PASO 5: Ejecutar el Proyecto

### **5.1 Iniciar Backend**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **5.2 Iniciar Frontend**
```bash
cd frontend
npm run dev
```

### **5.3 URLs**
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## ✅ Checklist para el Examen

### **Funcionalidades Básicas:**
- [ ] Registro de usuarios
- [ ] Inicio de sesión
- [ ] Crear posts con título, descripción e imagen
- [ ] Ver todos los posts en página principal
- [ ] Ver solo mis posts
- [ ] Eliminar mis posts
- [ ] Navegación SPA sin recargas
- [ ] Responsive design básico

### **Estructura Técnica:**
- [ ] React con hooks (useState, useEffect)
- [ ] Context API para estado global
- [ ] React Router para navegación
- [ ] Axios para llamadas HTTP
- [ ] FastAPI con endpoints REST
- [ ] SQLAlchemy con modelos
- [ ] Base de datos (SQLite mínimo)
- [ ] Autenticación por headers

### **Archivos Críticos:**
- [ ] `main.jsx` - Punto de entrada React
- [ ] `AuthContext.jsx` - Estado de autenticación
- [ ] `api.js` - Cliente HTTP
- [ ] `Navigation.jsx` - Barra de navegación
- [ ] `main.py` - API FastAPI
- [ ] `database.py` - Configuración BD
- [ ] `auth.py` y `posts.py` - Rutas de API

---

## 🎯 Tips para el Examen

1. **Prioriza funcionalidad sobre estilo**
2. **SQLite es suficiente (más fácil que PostgreSQL)**
3. **Bootstrap para UI rápida**
4. **Maneja errores básicos con try/catch y alert()**
5. **Usa console.log() para debugging**
6. **Testea cada endpoint en http://localhost:8000/docs**
7. **Verifica CORS si hay problemas de conexión**

### **Comandos de emergencia:**
```bash
# Si algo falla, reinstalar dependencias
rm -rf node_modules && npm install

# Si base de datos se corrompe
rm visual_board.db
# El SQLAlchemy la recreará automáticamente
```

---

## 📡 ANEXO: API Calls y React Fundamentals

### **A1. Conceptos Esenciales de React**

#### **A1.1 Hooks Fundamentales**
```jsx
import React, { useState, useEffect } from 'react'

function MiComponente() {
  // Estado local
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Efecto que se ejecuta al montar componente
  useEffect(() => {
    // Llamar API cuando se monta
    cargarDatos()
  }, []) // [] = solo se ejecuta una vez

  // Efecto que se ejecuta cuando cambia una variable
  useEffect(() => {
    console.log('Datos cambiaron:', datos)
  }, [datos]) // Se ejecuta cada vez que 'datos' cambia

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/datos')
      const resultado = await response.json()
      setDatos(resultado)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {datos.map(item => <div key={item.id}>{item.nombre}</div>)}
    </div>
  )
}
```

#### **A1.2 Eventos y Formularios**
```jsx
function FormularioPost() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  })

  // Manejar cambios en inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,                    // Mantener datos existentes
      [e.target.name]: e.target.value // Actualizar solo el campo que cambió
    })
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault() // Evitar recarga de página
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Post creado exitosamente')
        // Limpiar formulario
        setFormData({ title: '', description: '', image_url: '' })
      }
    } catch (error) {
      alert('Error al crear post')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Título"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descripción"
      />
      <input
        type="url"
        name="image_url"
        value={formData.image_url}
        onChange={handleChange}
        placeholder="URL de imagen"
        required
      />
      <button type="submit">Crear Post</button>
    </form>
  )
}
```

### **A2. Llamadas de API en JavaScript**

#### **A2.1 Con Fetch (Nativo)**
```javascript
// GET - Obtener datos
const obtenerPosts = async () => {
  try {
    const response = await fetch('http://localhost:8000/posts')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// POST - Crear nuevo recurso
const crearPost = async (postData) => {
  try {
    const response = await fetch('http://localhost:8000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': 'mi_usuario' // Header personalizado
      },
      body: JSON.stringify(postData)
    })

    if (!response.ok) {
      throw new Error('Error al crear post')
    }

    const nuevoPost = await response.json()
    return nuevoPost
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// PUT - Actualizar recurso completo
const actualizarPost = async (postId, postData) => {
  try {
    const response = await fetch(`http://localhost:8000/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': 'mi_usuario'
      },
      body: JSON.stringify(postData)
    })

    if (!response.ok) {
      throw new Error('Error al actualizar post')
    }

    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

// DELETE - Eliminar recurso
const eliminarPost = async (postId) => {
  try {
    const response = await fetch(`http://localhost:8000/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'X-User-Id': 'mi_usuario'
      }
    })

    if (!response.ok) {
      throw new Error('Error al eliminar post')
    }

    return true
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
```

#### **A2.2 Con Axios (Más fácil)**
```javascript
import axios from 'axios'

// Configurar cliente base
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const userData = sessionStorage.getItem('userData')
  if (userData) {
    const user = JSON.parse(userData)
    config.headers['X-User-Id'] = user.username
  }
  return config
})

// GET
const obtenerPosts = async () => {
  try {
    const response = await api.get('/posts')
    return response.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

// POST
const crearPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData)
    return response.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

// DELETE
const eliminarPost = async (postId) => {
  try {
    await api.delete(`/posts/${postId}`)
    return true
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}
```

### **A3. FastAPI - Crear APIs en Python**

#### **A3.1 Estructura Básica de Endpoint**
```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Modelo de datos (esquema)
class PostCreate(BaseModel):
    title: str
    description: str
    image_url: str

class PostResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: str
    user_id: str

# Lista en memoria (para ejemplo)
posts_db = []

# GET - Obtener todos los posts
@app.get("/posts", response_model=List[PostResponse])
def get_posts():
    return posts_db

# GET - Obtener post por ID
@app.get("/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: int):
    for post in posts_db:
        if post["id"] == post_id:
            return post
    raise HTTPException(status_code=404, detail="Post no encontrado")

# POST - Crear nuevo post
@app.post("/posts", response_model=PostResponse)
def create_post(post: PostCreate, x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    new_post = {
        "id": len(posts_db) + 1,
        "title": post.title,
        "description": post.description,
        "image_url": post.image_url,
        "user_id": x_user_id
    }
    
    posts_db.append(new_post)
    return new_post

# PUT - Actualizar post
@app.put("/posts/{post_id}", response_model=PostResponse)
def update_post(post_id: int, post: PostCreate, x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    for i, existing_post in enumerate(posts_db):
        if existing_post["id"] == post_id:
            if existing_post["user_id"] != x_user_id:
                raise HTTPException(status_code=403, detail="No autorizado")
            
            updated_post = {
                **existing_post,
                "title": post.title,
                "description": post.description,
                "image_url": post.image_url
            }
            posts_db[i] = updated_post
            return updated_post
    
    raise HTTPException(status_code=404, detail="Post no encontrado")

# DELETE - Eliminar post
@app.delete("/posts/{post_id}")
def delete_post(post_id: int, x_user_id: str = Header(None)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    for i, post in enumerate(posts_db):
        if post["id"] == post_id:
            if post["user_id"] != x_user_id:
                raise HTTPException(status_code=403, detail="No autorizado")
            
            posts_db.pop(i)
            return {"message": "Post eliminado"}
    
    raise HTTPException(status_code=404, detail="Post no encontrado")
```

#### **A3.2 Manejo de Errores y Validaciones**
```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, validator
import re

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    
    @validator('username')
    def username_must_be_valid(cls, v):
        if len(v) < 3:
            raise ValueError('Username debe tener al menos 3 caracteres')
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Username solo puede contener letras, números y _')
        return v
    
    @validator('email')
    def email_must_be_valid(cls, v):
        if '@' not in v:
            raise ValueError('Email inválido')
        return v
    
    @validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 6:
            raise ValueError('Password debe tener al menos 6 caracteres')
        return v

@app.post("/users/register")
def register_user(user: UserCreate):
    try:
        # Lógica de registro aquí
        return {"message": "Usuario creado exitosamente"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor"
        )
```

#### **A3.3 Middleware y CORS**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS para permitir requests desde frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL del frontend
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Todos los headers
)

# Middleware personalizado
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response: {response.status_code}")
    return response
```

### **A4. Integración React + API**

#### **A4.1 Hook Personalizado para API**
```jsx
import { useState, useEffect } from 'react'
import { postsAPI } from '../services/api'

// Custom hook para manejar posts
function usePosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Cargar posts
  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await postsAPI.getAll()
      setPosts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Crear post
  const createPost = async (postData) => {
    try {
      const newPost = await postsAPI.create(postData)
      setPosts(prev => [newPost, ...prev]) // Agregar al inicio
      return newPost
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Eliminar post
  const deletePost = async (postId) => {
    try {
      await postsAPI.delete(postId)
      setPosts(prev => prev.filter(post => post.id !== postId))
      return true
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Cargar posts al montar hook
  useEffect(() => {
    loadPosts()
  }, [])

  return {
    posts,
    loading,
    error,
    loadPosts,
    createPost,
    deletePost
  }
}

// Usar el hook en componente
function PostsList() {
  const { posts, loading, error, deletePost } = usePosts()

  const handleDelete = async (postId) => {
    if (window.confirm('¿Eliminar este post?')) {
      try {
        await deletePost(postId)
        alert('Post eliminado')
      } catch (error) {
        alert('Error al eliminar')
      }
    }
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          <button onClick={() => handleDelete(post.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  )
}
```

#### **A4.2 Manejo de Estados de Loading**
```jsx
function ComponenteConAPI() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await api.get('/datos')
      setData(response.data)
    } catch (err) {
      setError('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Renderizado condicional
  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
        <button onClick={fetchData} className="btn btn-link">
          Reintentar
        </button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-muted">
        No hay datos para mostrar
      </div>
    )
  }

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.nombre}</div>
      ))}
    </div>
  )
}
```

### **A5. Comandos Útiles para el Examen**

```bash
# FastAPI
pip install fastapi uvicorn
uvicorn main:app --reload

# React
npm create vite@latest mi-app -- --template react
npm install axios react-router-dom bootstrap

# Testing API endpoints
curl -X GET http://localhost:8000/posts
curl -X POST http://localhost:8000/posts -H "Content-Type: application/json" -d '{"title":"Test","description":"Test","image_url":"test.jpg"}'

# Ver documentación automática de FastAPI
# http://localhost:8000/docs
```

¡Éxito en tu examen! 🎓