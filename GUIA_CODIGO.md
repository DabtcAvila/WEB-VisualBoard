# 📍 Guía de Navegación del Código - Visual Board

## 🗂️ Estructura General del Proyecto

```
WEB-VisualBoard/
├── frontend/                 # Aplicación React (Cliente)
├── backend/                  # API FastAPI (Servidor)
├── visual_board_schema.sql   # Esquema de base de datos
└── GUIA_CODIGO.md           # Este archivo
```

---

## 🎨 FRONTEND - React Application

### 📁 Estructura Principal
```
frontend/src/
├── components/      # Componentes reutilizables
├── pages/          # Páginas principales
├── context/        # Contextos de React
├── hooks/          # Custom Hooks
├── services/       # Servicios de API
├── config/         # Configuraciones
├── utils/          # Utilidades
├── App.jsx         # Componente principal
└── main.jsx        # Punto de entrada
```

### 🔑 Archivos Esenciales del Frontend

#### **1. Autenticación y Estado Global**
- **`src/context/AuthContext.jsx`** ⭐ **CRÍTICO**
  - Sistema de autenticación centralizado
  - Manejo de estado de usuario
  - Context API para toda la aplicación

- **`src/components/UserAuth.jsx`** ⭐ **ESENCIAL**
  - Modal de login/registro
  - Formularios de autenticación
  - Integración con backend

#### **2. Navegación y Layout**
- **`src/App.jsx`** ⭐ **CRÍTICO**
  - Componente raíz
  - Provider de autenticación
  - Estructura principal

- **`src/components/Navigation.jsx`** ⭐ **ESENCIAL**
  - Barra de navegación principal
  - Menú de usuario
  - Enlaces principales

#### **3. Páginas Principales**
- **`src/pages/Home.jsx`** ⭐ **ESENCIAL**
  - Página de inicio
  - Grid principal de posts
  - Funcionalidad de "Me gusta"

- **`src/pages/Discover.jsx`** ⭐ **IMPORTANTE**
  - Descubrimiento con Unsplash API
  - Explorar contenido nuevo
  - Integración con API externa

- **`src/pages/CreatePost.jsx`** ⭐ **ESENCIAL**
  - Crear nuevos posts
  - Subida de imágenes
  - Formulario de creación

- **`src/pages/MyPosts.jsx`** ⭐ **IMPORTANTE**
  - Posts del usuario actual
  - Gestión personal de contenido

- **`src/pages/EditPost.jsx`** ⭐ **IMPORTANTE**
  - Editar posts existentes
  - Validación de permisos

#### **4. Componentes Críticos**
- **`src/components/MasonryGrid.jsx`** ⭐ **ESENCIAL**
  - Layout tipo Pinterest
  - Distribución automática de posts
  - Responsive design

- **`src/components/ImageCard.jsx`** ⭐ **ESENCIAL**
  - Tarjetas de imagen individuales
  - Botones de acción (like, editar, eliminar)
  - Información de posts

- **`src/components/PostDetailModal.jsx`** ⭐ **IMPORTANTE**
  - Modal de detalles de post
  - Vista ampliada de contenido

- **`src/components/ImageHealthChecker.jsx`** ⭐ **ÚTIL**
  - Verificador de imágenes rotas
  - Tool de mantenimiento

#### **5. Servicios y Configuración**
- **`src/services/api.js`** ⭐ **CRÍTICO**
  - Cliente de API principal
  - Configuración de axios
  - Endpoints principales

- **`src/config/api.js`** ⭐ **CRÍTICO**
  - URLs de configuración
  - Variables de entorno

- **`src/hooks/usePosts.js`** ⭐ **IMPORTANTE**
  - Hook personalizado para posts
  - Lógica de carga de datos

#### **6. Archivos de Configuración**
- **`package.json`** ⭐ **CRÍTICO**
  - Dependencias del proyecto
  - Scripts de build y desarrollo

- **`vite.config.js`** ⭐ **IMPORTANTE**
  - Configuración de Vite
  - Base path para GitHub Pages

- **`index.html`** ⭐ **IMPORTANTE**
  - HTML principal
  - Meta tags y configuración

---

## 🔧 BACKEND - FastAPI Application

### 📁 Estructura Principal
```
backend/
├── app/
│   ├── api/         # Endpoints de la API
│   ├── core/        # Configuración central
│   ├── models/      # Modelos de base de datos
│   ├── schemas/     # Esquemas de validación
│   └── services/    # Servicios de negocio
├── main.py          # Punto de entrada
└── requirements.txt # Dependencias Python
```

### 🔑 Archivos Esenciales del Backend

#### **1. Punto de Entrada**
- **`main.py`** ⭐ **CRÍTICO**
  - Configuración de FastAPI
  - CORS y middleware
  - Importación de rutas

#### **2. Configuración Central**
- **`app/core/config.py`** ⭐ **CRÍTICO**
  - Variables de entorno
  - Configuración de base de datos
  - Settings de la aplicación

- **`app/core/database.py`** ⭐ **CRÍTICO**
  - Conexión a PostgreSQL
  - Configuración de SQLAlchemy
  - Session management

#### **3. API Endpoints**
- **`app/api/posts.py`** ⭐ **ESENCIAL**
  - CRUD completo de posts
  - Validaciones de permisos
  - Paginación y filtros

- **`app/api/users.py`** ⭐ **ESENCIAL**
  - Registro e inicio de sesión
  - Gestión de usuarios
  - Autenticación

- **`app/api/discover.py`** ⭐ **IMPORTANTE**
  - Integración con Unsplash API
  - Endpoint de descubrimiento

- **`app/api/upload.py`** ⭐ **IMPORTANTE**
  - Subida de archivos
  - Manejo de imágenes

- **`app/api/health.py`** ⭐ **ÚTIL**
  - Health checks
  - Monitoreo del sistema

#### **4. Modelos de Datos**
- **`app/models/user.py`** ⭐ **CRÍTICO**
  - Modelo de usuario en BD
  - Relaciones con posts

- **`app/models/post.py`** ⭐ **CRÍTICO**
  - Modelo de post en BD
  - Campos y validaciones

#### **5. Esquemas de Validación**
- **`app/schemas/user.py`** ⭐ **IMPORTANTE**
  - Validación de datos de usuario
  - DTOs para API

- **`app/schemas/post.py`** ⭐ **IMPORTANTE**
  - Validación de datos de post
  - Request/Response schemas

#### **6. Servicios**
- **`app/services/unsplash_service.py`** ⭐ **IMPORTANTE**
  - Integración con Unsplash API
  - Manejo de imágenes externas

---

## 🗄️ BASE DE DATOS

### 📄 Archivos de Base de Datos
- **`visual_board_schema.sql`** ⭐ **CRÍTICO**
  - Esquema completo de la base de datos
  - Tablas: users, posts
  - Índices y constrains

---

## 🔧 Configuración y Deploy

### 📁 GitHub Actions
- **`.github/workflows/deploy.yml`** ⭐ **IMPORTANTE**
  - Pipeline de deploy automático
  - Build y deploy a GitHub Pages

### 📁 Archivos de Configuración
- **`frontend/package.json`** - Dependencias React
- **`backend/requirements.txt`** - Dependencias Python
- **`render.yaml`** - Configuración para Render

---

## 🎯 Flujos de Código Críticos

### **1. Flujo de Autenticación** 🔐
```
UserAuth.jsx → AuthContext.jsx → api/users.py → models/user.py
```

### **2. Flujo de Posts** 📝
```
Home.jsx → MasonryGrid.jsx → ImageCard.jsx → api/posts.py → models/post.py
```

### **3. Flujo de Creación** ➕
```
CreatePost.jsx → services/api.js → api/posts.py + api/upload.py
```

### **4. Flujo de Descubrimiento** 🔍
```
Discover.jsx → api/discover.py → services/unsplash_service.py
```

---

## 🚨 Puntos Críticos para Modificaciones

### ⚠️ **NUNCA Modificar Sin Cuidado:**
1. **`AuthContext.jsx`** - Sistema de autenticación central
2. **`api/posts.py`** - CRUD principal de posts
3. **`database.py`** - Configuración de BD
4. **`main.py`** - Configuración de FastAPI

### ✅ **Seguro para Modificar:**
1. Estilos CSS en componentes
2. Textos y labels
3. Configuraciones de UI
4. Documentación

### 🔧 **Requiere Pruebas:**
1. Cualquier cambio en `services/api.js`
2. Modificaciones en modelos de BD
3. Cambios en esquemas de validación
4. Updates en hooks personalizados

---

## 📱 Componentes por Funcionalidad

### **Autenticación:**
- `AuthContext.jsx` | `UserAuth.jsx` | `api/users.py`

### **Posts Principal:**
- `Home.jsx` | `MasonryGrid.jsx` | `ImageCard.jsx` | `api/posts.py`

### **Creación de Contenido:**
- `CreatePost.jsx` | `EditPost.jsx` | `api/upload.py`

### **Descubrimiento:**
- `Discover.jsx` | `api/discover.py` | `unsplash_service.py`

### **Navegación:**
- `Navigation.jsx` | `App.jsx`

### **Utilidades:**
- `ImageHealthChecker.jsx` | `BrokenImageHandler.jsx`

---

## 🔍 Para Debugging

### **Frontend Issues:**
1. Revisar console del navegador
2. Verificar `AuthContext.jsx` para problemas de estado
3. Revisar `services/api.js` para errores de red

### **Backend Issues:**
1. Logs de FastAPI en terminal
2. Verificar `database.py` para problemas de conexión
3. Revisar `main.py` para configuración CORS

### **Deploy Issues:**
1. GitHub Actions logs
2. Verificar `vite.config.js` base path
3. Comprobar `package.json` scripts

---

*Esta guía te permitirá navegar eficientemente por el código y entender dónde está cada funcionalidad esencial del proyecto.*