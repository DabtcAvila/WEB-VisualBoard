from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.api import posts, discover, health, users, upload, image_health

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS - Permitir localhost en desarrollo y GitHub Pages en producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:3000",
        "https://dabtcavila.github.io",  # GitHub Pages
        "https://DabtcAvila.github.io"    # GitHub Pages (case variations)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(posts.router, prefix=settings.API_V1_STR)
app.include_router(discover.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(image_health.router, prefix=settings.API_V1_STR)
app.include_router(health.router)

@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/debug/env")
async def debug_env():
    """Debug endpoint to check environment variables"""
    import os
    return {
        "UNSPLASH_ACCESS_KEY_set": bool(os.getenv("UNSPLASH_ACCESS_KEY")),
        "UNSPLASH_API_KEY_set": bool(os.getenv("UNSPLASH_API_KEY")),
        "DATABASE_URL_set": bool(os.getenv("DATABASE_URL")),
        "settings_UNSPLASH": bool(settings.UNSPLASH_ACCESS_KEY),
        "settings_UNSPLASH_first_chars": settings.UNSPLASH_ACCESS_KEY[:4] if settings.UNSPLASH_ACCESS_KEY else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=settings.DEBUG)