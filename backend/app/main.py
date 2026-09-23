from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes import health, inputs, planning, validation, analysis, decision, export, runs

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="RAILBLOCK AI-Powered Automatic Block Planning Engine (SIH Problem Statement 26027)"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(health.router)
app.include_router(inputs.router)
app.include_router(planning.router)
app.include_router(validation.router)
app.include_router(analysis.router)
app.include_router(decision.router)
app.include_router(export.router)
app.include_router(runs.router)

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "corridor": "Secunderabad (SEC) - Nandyal (NDL)"
    }

@app.get("/api/health")
def api_health():
    return {
        "status": "HEALTHY",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "solver_backend": "Google OR-Tools CP-SAT",
        "ml_backend": "XGBoost Regressor",
        "corridor": "Secunderabad (SEC) - Nandyal (NDL)"
    }
