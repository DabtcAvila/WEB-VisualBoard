# 🎯 Visual Board - Cheatsheet Completo

## 📁 Estructura del Proyecto

```
visual-board/
├── frontend/
│   ├── public/
│   │   └── index.html -----------------------------------------> [1.01]
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx --------------------------------> [1.02]
│   │   │   ├── PostCard.jsx ---------------------------------> [1.03]
│   │   │   └── UserAuth.jsx ---------------------------------> [1.04]
│   │   ├── pages/
│   │   │   ├── Home.jsx ------------------------------------> [1.05]
│   │   │   ├── CreatePost.jsx ------------------------------> [1.06]
│   │   │   └── MyPosts.jsx ---------------------------------> [1.07]
│   │   ├── context/
│   │   │   └── AuthContext.jsx -----------------------------> [1.08]
│   │   ├── services/
│   │   │   └── api.js --------------------------------------> [1.09]
│   │   ├── App.jsx -----------------------------------------> [1.10]
│   │   └── main.jsx ----------------------------------------> [1.11]
│   ├── package.json ----------------------------------------> [1.12]
│   └── vite.config.js --------------------------------------> [1.13]
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── user.py -------------------------------------> [2.01]
│   │   │   └── post.py -------------------------------------> [2.02]
│   │   ├── routes/
│   │   │   ├── auth.py -------------------------------------> [2.03]
│   │   │   └── posts.py ------------------------------------> [2.04]
│   │   ├── database.py -------------------------------------> [2.05]
│   │   └── main.py -----------------------------------------> [2.06]
│   └── requirements.txt ------------------------------------> [2.07]
└── schema.sql ----------------------------------------------> [2.08]
```

## 💻 Código Esencial

### **[1.01] frontend/public/index.html**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visual Board</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### **[1.02] frontend/src/components/Navigation.jsx**
```jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import UserAuth from './UserAuth'

function Navigation() {
  const { currentUser, logout, isAuthenticated } = useAuth()

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Visual Board</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Inicio</Nav.Link>
          {isAuthenticated() && (
            <>
              <Nav.Link as={Link} to="/create">Crear</Nav.Link>
              <Nav.Link as={Link} to="/my-posts">Mis Posts</Nav.Link>
            </>
          )}
        </Nav>
        <Nav>
          {isAuthenticated() ? (
            <Button variant="outline-light" onClick={logout}>
              Cerrar ({currentUser.username})
            </Button>
          ) : (
            <UserAuth />
          )}
        </Nav>
      </Container>
    </Navbar>
  )
}

export default Navigation
```

### **[1.03] frontend/src/components/PostCard.jsx**
```jsx
import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { postsAPI } from '../services/api'

function PostCard({ post, onDelete }) {
  const { currentUser } = useAuth()
  const isOwner = currentUser?.username === post.user_id

  const handleDelete = async () => {
    if (window.confirm('¿Eliminar post?')) {
      try {
        await postsAPI.delete(post.id)
        onDelete(post.id)
      } catch (error) {
        alert('Error al eliminar')
      }
    }
  }

  return (
    <Card className="mb-3">
      <Card.Img variant="top" src={post.image_url} style={{height: '200px', objectFit: 'cover'}} />
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.description}</Card.Text>
        <small className="text-muted">Por: {post.user_id}</small>
        {isOwner && (
          <div className="mt-2">
            <Button variant="danger" size="sm" onClick={handleDelete}>Eliminar</Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default PostCard
```

### **[1.04] frontend/src/components/UserAuth.jsx**
```jsx
import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

function UserAuth() {
  const { login } = useAuth()
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
        response = await authAPI.login({ username: formData.username, password: formData.password })
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
      <Button variant="outline-light" onClick={() => setShowModal(true)}>
        Iniciar Sesión
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isLogin ? 'Iniciar Sesión' : 'Registro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Usuario"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </Form.Group>
            {!isLogin && (
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Contraseña"
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
              {isLogin ? 'Crear cuenta' : 'Ya tengo cuenta'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default UserAuth
```

### **[1.05] frontend/src/pages/Home.jsx**
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
      console.error('Error:', error)
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

### **[1.06] frontend/src/pages/CreatePost.jsx**
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
    title: '', description: '', image_url: ''
  })

  if (!isAuthenticated()) {
    return <div>Debes iniciar sesión</div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await postsAPI.create(formData)
      navigate('/')
    } catch (error) {
      alert('Error al crear post')
    }
  }

  return (
    <div>
      <h1>Crear Post</h1>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Título"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                placeholder="Descripción"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="url"
                placeholder="URL de imagen"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">Crear</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CreatePost
```

### **[1.07] frontend/src/pages/MyPosts.jsx**
```jsx
import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import { postsAPI } from '../services/api'

function MyPosts() {
  const { isAuthenticated } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated()) {
      loadMyPosts()
    }
  }, [isAuthenticated])

  const loadMyPosts = async () => {
    try {
      const response = await postsAPI.getMyPosts()
      setPosts(response.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId))
  }

  if (!isAuthenticated()) return <div>Inicia sesión</div>
  if (loading) return <div>Cargando...</div>

  return (
    <div>
      <h1>Mis Posts</h1>
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

export default MyPosts
```

### **[1.08] frontend/src/context/AuthContext.jsx**
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

  const value = { currentUser, login, logout, isAuthenticated, loading }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### **[1.09] frontend/src/services/api.js**
```javascript
import axios from 'axios'

const API_BASE = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const userData = sessionStorage.getItem('userData')
  if (userData) {
    const user = JSON.parse(userData)
    config.headers['X-User-Id'] = user.username
  }
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
}

export const postsAPI = {
  getAll: () => api.get('/posts'),
  getMyPosts: () => api.get('/posts/my'),
  create: (data) => api.post('/posts', data),
  delete: (id) => api.delete(`/posts/${id}`)
}

export default api
```

### **[1.10] frontend/src/App.jsx**
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

### **[1.11] frontend/src/main.jsx**
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

### **[1.12] frontend/package.json**
```json
{
  "name": "visual-board-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
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

### **[1.13] frontend/vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})
```

### **[2.01] backend/app/models/user.py**
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

### **[2.02] backend/app/models/post.py**
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
    user_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### **[2.03] backend/app/routes/auth.py**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt
from app.database import get_db
from app.models.user import User

router = APIRouter()

@router.post("/register")
def register(user_data: dict, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == user_data["username"]) | 
        (User.email == user_data["email"])
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    
    password_hash = bcrypt.hashpw(
        user_data["password"].encode('utf-8'), 
        bcrypt.gensalt()
    ).decode('utf-8')
    
    db_user = User(
        username=user_data["username"],
        email=user_data["email"],
        password_hash=password_hash
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"username": db_user.username, "email": db_user.email}

@router.post("/login")
def login(credentials: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == credentials["username"]).first()
    
    if not user or not bcrypt.checkpw(
        credentials["password"].encode('utf-8'), 
        user.password_hash.encode('utf-8')
    ):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    return {"username": user.username, "email": user.email}
```

### **[2.04] backend/app/routes/posts.py**
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
def get_my_posts(x_user_id: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    posts = db.query(Post).filter(Post.user_id == x_user_id).all()
    return posts

@router.post("/")
def create_post(post_data: dict, x_user_id: Optional[str] = Header(None), db: Session = Depends(get_db)):
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
def delete_post(post_id: int, x_user_id: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not x_user_id:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    if post.user_id != x_user_id:
        raise HTTPException(status_code=403, detail="No autorizado")
    
    db.delete(post)
    db.commit()
    return {"message": "Eliminado"}
```

### **[2.05] backend/app/database.py**
```python
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./visual_board.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

### **[2.06] backend/app/main.py**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, posts

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Visual Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(posts.router, prefix="/posts", tags=["posts"])

@app.get("/")
def read_root():
    return {"message": "Visual Board API"}
```

### **[2.07] backend/requirements.txt**
```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
python-multipart==0.0.6
bcrypt==4.1.2
```

### **[2.08] schema.sql**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Comandos de Ejecución

```bash
# Crear proyecto
npm create vite@latest frontend -- --template react
cd frontend && npm install react-router-dom axios bootstrap

# Instalar backend
pip install fastapi uvicorn sqlalchemy python-multipart bcrypt

# Ejecutar
cd backend && uvicorn app.main:app --reload
cd frontend && npm run dev
```
