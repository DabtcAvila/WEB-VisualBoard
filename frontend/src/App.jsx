import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Discover from './pages/Discover'
import MyPosts from './pages/MyPosts'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </main>
      <footer className="bg-light py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0 text-muted">© 2025 Visual Board - Proyecto Integrador COM-11117</p>
          <small className="text-muted">David Fernando Avila Díaz | 197851</small>
          <br />
          <small className="text-muted">Emiliano Sebastián Millán Giffard | 214360</small>
        </div>
      </footer>
    </AuthProvider>
  )
}

export default App