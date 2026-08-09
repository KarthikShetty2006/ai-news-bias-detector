from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.prediction import router as prediction_router
from app.routes.health import router as health_router

app = FastAPI(
    title="AI News Bias Detector ML Service",
    description="""
Machine Learning Microservice for AI News Bias Detector.

Features:
- Sentiment Analysis
- Political Bias Detection
- Subjectivity Detection
- Clickbait Detection

This service is consumed by the Express Backend.
""",
    version="1.0.0",
)

# -----------------------------
# CORS Configuration
# -----------------------------
origins = [
    "http://localhost:5173",   # React (Vite)
    "http://localhost:5000",   # Express Backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(health_router)
app.include_router(health_router)
app.include_router(prediction_router)