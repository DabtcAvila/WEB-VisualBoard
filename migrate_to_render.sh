#!/bin/bash

# Script para migrar datos a Render PostgreSQL
# Uso: ./migrate_to_render.sh "postgresql://usuario:password@host/database"

if [ $# -eq 0 ]; then
    echo "❌ Error: Proporciona la URL de PostgreSQL de Render"
    echo "Uso: ./migrate_to_render.sh 'postgresql://...'"
    exit 1
fi

RENDER_DB_URL=$1

echo "🚀 Iniciando migración a Render..."

# 1. Crear las tablas en Render
echo "📝 Creando esquema en Render..."
psql "$RENDER_DB_URL" < visual_board_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Esquema creado exitosamente"
else
    echo "⚠️  Posible error creando esquema (puede que ya exista)"
fi

# 2. Importar los datos
echo "📦 Importando datos..."
psql "$RENDER_DB_URL" < visual_board_backup.sql

if [ $? -eq 0 ]; then
    echo "✅ Datos importados exitosamente"
else
    echo "❌ Error importando datos"
    exit 1
fi

# 3. Verificar
echo "🔍 Verificando migración..."
psql "$RENDER_DB_URL" -c "SELECT COUNT(*) as posts FROM posts; SELECT COUNT(*) as users FROM users;"

echo "✅ ¡Migración completada!"
echo ""
echo "📝 Siguiente paso:"
echo "1. Actualiza frontend/src/config/api.js con tu URL de Render"
echo "2. Ejecuta: cd frontend && npm run deploy"