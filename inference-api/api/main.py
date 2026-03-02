
# # api/main.py

# from __future__ import annotations

# import logging

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv

# from src.utils.logging_config import setup_logging
# from src.utils.config_loader import ensure_directories

# # Load .env first so GROQ_API_KEY, ADMIN_USER, etc. are available
# load_dotenv()

# # Configure logging BEFORE importing routers
# setup_logging()
# logger = logging.getLogger(__name__)

# from api.routes import query, ingest, feedback  # noqa: E402


# app = FastAPI(
#     title="Agentic RAG Chatbot API",
#     description="Agentic RAG Chatbot for HR & IT Assets",
#     version="1.0.0",
# )

# # Ensure data/db/logs/tmp directories exist
# ensure_directories()

# # ---- CORS middleware (for frontend) ----
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",      # e.g. React/Vite
#         "http://localhost:5173",      # Vite alternative
#         "http://127.0.0.1:3000",
#         "http://127.0.0.1:5173",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],              # Allow all HTTP methods
#     allow_headers=["*"],              # Allow all headers
# )

# # ---- Routers ----
# app.include_router(query.router, tags=["Query"])
# app.include_router(ingest.router, tags=["Ingestion"])
# app.include_router(feedback.router, tags=["Feedback"])

# # ---- Health & root endpoints ----
# @app.get("/health")
# async def health_check():
#     return {"status": "healthy", "message": "RAG API is running"}


# @app.get("/")
# async def root():
#     logger.info("Root endpoint called")
#     return {"message": "Agentic RAG Chatbot API", "docs": "/docs"}


# @app.on_event("startup")
# async def on_startup():
#     logger.info("API startup complete.")


# @app.on_event("shutdown")
# async def on_shutdown():
#     logger.info("API shutting down.")
# api/main.py

from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load .env first so GROQ_API_KEY, ADMIN_USER, etc. are available
load_dotenv()

# Initialize logging
from src.utils.logging_config import setup_logging
from src.utils.config_loader import ensure_directories

setup_logging()
logger = logging.getLogger(__name__)

# Create FastAPI app FIRST
app = FastAPI(
    title="Agentic RAG Chatbot API",
    description="Agentic RAG Chatbot for HR & IT Assets",
    version="1.0.0",
)

# Ensure data/db/logs/tmp directories exist
ensure_directories()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers AFTER app is created to avoid circular imports
from api.routes.query import router as query_router
from api.routes.ingest import router as ingest_router
from api.routes.feedback import router as feedback_router
from api.routes.admin import router as admin_router

# Include routers
app.include_router(query_router, tags=["Query"])
app.include_router(ingest_router, tags=["Ingestion"])
app.include_router(feedback_router, tags=["Feedback"])
app.include_router(admin_router, tags=["Admin"])


# Health & root endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "RAG API is running"}


@app.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"message": "Agentic RAG Chatbot API", "docs": "/docs"}


@app.on_event("startup")
async def on_startup():
    logger.info("API startup complete.")


@app.on_event("shutdown")
async def on_shutdown():
    logger.info("API shutting down.")