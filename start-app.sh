#!/bin/bash

echo "🟢 Activation de l'environnement Python..."
source .venv/bin/activate

echo "🚀 Lancement de l'API FastAPI..."
uvicorn python.main:app --host 0.0.0.0 --port 8000 &

# Capture le PID de FastAPI pour pouvoir l'arrêter proprement si besoin
FASTAPI_PID=$!

echo "🌍 Lancement de l'application Next.js..."
npm run dev

# Quand Next.js est terminé (Ctrl+C), tuer FastAPI
echo "🛑 Arrêt de FastAPI (PID: $FASTAPI_PID)..."
kill $FASTAPI_PID
