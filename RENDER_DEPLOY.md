# 🚀 Despliegue del Backend en Render.com

## Pasos para Desplegar:

### 1. Crear Cuenta en Render
1. Ve a [render.com](https://render.com)
2. Regístrate con tu cuenta de GitHub

### 2. Crear un Nuevo Web Service

1. Click en "New +" → "Web Service"
2. Conecta tu repositorio GitHub: `DabtcAvila/WEB-VisualBoard`
3. Configura el servicio:

**Configuración del Servicio:**
```
Name: visual-board-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3. Variables de Entorno

Agrega estas variables en la sección "Environment":

```bash
# Base de datos (se creará automáticamente)
DATABASE_URL=<se genera automáticamente>

# API Key de Unsplash (IMPORTANTE: Agrega tu key real)
UNSPLASH_API_KEY=tu_api_key_aqui

# Secret Key (se genera automáticamente)
SECRET_KEY=<click en Generate>

# Debug
DEBUG=False

# Python Version
PYTHON_VERSION=3.11.0
```

### 4. Crear Base de Datos PostgreSQL

1. En el Dashboard de Render, click en "New +" → "PostgreSQL"
2. Configuración:
   - Name: `visual-board-db`
   - Plan: Free
   - Region: Same as your web service (Oregon)
3. Una vez creada, copia la "Internal Database URL"
4. Ve a tu Web Service → Environment → Add `DATABASE_URL` con esa URL

### 5. Desplegar

1. Click en "Create Web Service"
2. Render comenzará el build automáticamente
3. Espera 5-10 minutos para el primer despliegue

### 6. Obtener la URL del Backend

Una vez desplegado, tu backend estará en:
```
https://visual-board-api.onrender.com
```

## 📝 Verificación

Verifica que funciona visitando:
- Health Check: `https://visual-board-api.onrender.com/health`
- API Docs: `https://visual-board-api.onrender.com/docs`

## ⚠️ IMPORTANTE: Actualizar el Frontend

Una vez tengas la URL del backend, actualiza el frontend:

1. Edita `frontend/src/config/api.js`:
```javascript
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8000' 
  : 'https://visual-board-api.onrender.com'  // Tu URL de Render
```

2. Redespliega el frontend:
```bash
cd frontend
npm run deploy
```

## 🔧 Solución de Problemas

### Si el build falla:
- Verifica que `requirements.txt` esté actualizado
- Revisa los logs en Render Dashboard

### Si la base de datos no conecta:
- Verifica que DATABASE_URL esté configurada
- Asegúrate de que usa `postgresql://` no `postgres://`

### Si las imágenes no cargan:
- Verifica que UNSPLASH_API_KEY esté configurada
- Revisa los CORS settings en main.py

## 📊 Plan Gratuito de Render

**Limitaciones del plan gratuito:**
- 750 horas de servicio por mes
- El servicio se suspende después de 15 minutos de inactividad
- Se reactiva automáticamente cuando recibe una petición
- Primera petición después de inactividad puede tardar 30-60 segundos

**Recomendación:** Para evitar la suspensión, puedes usar un servicio de monitoring como UptimeRobot para hacer ping cada 10 minutos.

---

¡Tu backend estará listo en Render.com en unos minutos! 🎉