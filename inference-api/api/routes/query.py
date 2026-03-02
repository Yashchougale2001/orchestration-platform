
# # # api/routes/query.py

# # from __future__ import annotations

# # from typing import Any, List, Literal

# # from fastapi import APIRouter, HTTPException
# # from pydantic import BaseModel

# # from src.agent.graph_agent import build_basic_hr_agent

# # router = APIRouter()

# # RoleLiteral = Literal["admin", "hr", "employee"]


# # class QueryRequest(BaseModel):
# #     question: str
# #     user_id: str
# #     role: RoleLiteral  # "admin", "hr", or "employee"


# # class QueryResponse(BaseModel):
# #     answer: str
# #     steps: List[str] = []
# #     context_sources: List[str] = []


# # # Compile LangGraph agent once
# # compiled_graph: Any = build_basic_hr_agent().compile()


# # @router.post("/query", response_model=QueryResponse)
# # async def query_endpoint(request: QueryRequest) -> QueryResponse:
# #     """
# #     Main query endpoint for the RAG chatbot.
# #     """
# #     try:
# #         result = compiled_graph.invoke(
# #             {
# #                 "question": request.question,
# #                 "user_id": request.user_id,
# #                 "role": request.role,
# #             }
# #         ) or {}

# #         answer = result.get("answer") or "No answer generated"
# #         steps = result.get("steps") or []
# #         context = result.get("context") or []

# #         sources = sorted(
# #             {
# #                 d.get("metadata", {}).get("source", "unknown")
# #                 for d in context
# #             }
# #         )

# #         return QueryResponse(
# #             answer=answer,
# #             steps=steps,
# #             context_sources=sources,
# #         )

# #     except Exception:
# #         # Avoid leaking internal errors to client
# #         raise HTTPException(status_code=500, detail="Internal server error")
# from __future__ import annotations

# import logging

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from dotenv import load_dotenv

# from src.utils.logging_config import setup_logging
# from src.utils.config_loader import ensure_directories

# # Load .env first
# load_dotenv()

# # Configure logging BEFORE importing routers
# setup_logging()
# logger = logging.getLogger(__name__)

# from api.routes import query, ingest, feedback, admin  # ✅ Add admin

# app = FastAPI(
#     title="Agentic RAG Chatbot API",
#     description="Agentic RAG Chatbot for HR & IT Assets",
#     version="1.0.0",
# )

# # Ensure directories exist
# ensure_directories()

# # CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://localhost:5173",
#         "http://127.0.0.1:3000",
#         "http://127.0.0.1:5173",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Routers
# app.include_router(query.router, tags=["Query"])
# app.include_router(ingest.router, tags=["Ingestion"])
# app.include_router(feedback.router, tags=["Feedback"])
# app.include_router(admin.router, tags=["Admin"])  # ✅ Add admin router

# # Health & root endpoints
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
# api/routes/query.py

from __future__ import annotations

import json
import time
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, List, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()
logger = logging.getLogger(__name__)

RoleLiteral = Literal["admin", "hr", "employee"]


class QueryRequest(BaseModel):
    question: str
    user_id: str
    role: RoleLiteral


class QueryResponse(BaseModel):
    answer: str
    steps: List[str] = []
    context_sources: List[str] = []


def get_compiled_graph():
    """Lazy load the compiled graph to avoid import issues."""
    from src.agent.graph_agent import build_basic_hr_agent
    return build_basic_hr_agent().compile()


# Lazy initialization
_compiled_graph = None


def log_query(
    user_id: str,
    role: str,
    question: str,
    sources: List[str],
    response_time_ms: int,
    status: str = "success"
):
    """Log query details to queries.jsonl for analytics."""
    try:
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)
        
        query_log = log_dir / "queries.jsonl"
        
        entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": user_id,
            "role": role,
            "question": question,
            "sources": sources,
            "response_time_ms": response_time_ms,
            "status": status
        }
        
        with open(query_log, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")
    
    except Exception as e:
        logger.error(f"Failed to log query: {e}")


@router.post("/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest) -> QueryResponse:
    """
    Main query endpoint for the RAG chatbot.
    """
    global _compiled_graph
    
    start_time = time.time()
    
    try:
        logger.info(f"Query from user_id={request.user_id}, role={request.role}")
        
        # Lazy load the compiled graph
        if _compiled_graph is None:
            _compiled_graph = get_compiled_graph()
        
        result = _compiled_graph.invoke(
            {
                "question": request.question,
                "user_id": request.user_id,
                "role": request.role,
            }
        ) or {}

        answer = result.get("answer") or "No answer generated"
        steps = result.get("steps") or []
        context = result.get("context") or []

        sources = sorted(
            {
                d.get("metadata", {}).get("source", "unknown")
                for d in context
                if isinstance(d, dict)
            }
        )
        
        # Calculate response time
        response_time_ms = int((time.time() - start_time) * 1000)
        
        # Log query for analytics
        log_query(
            user_id=request.user_id,
            role=request.role,
            question=request.question,
            sources=sources,
            response_time_ms=response_time_ms,
            status="success"
        )
        
        logger.info(f"Query completed in {response_time_ms}ms, sources: {sources}")

        return QueryResponse(
            answer=answer,
            steps=steps,
            context_sources=sources,
        )

    except Exception as e:
        # Log failed query
        response_time_ms = int((time.time() - start_time) * 1000)
        log_query(
            user_id=request.user_id,
            role=request.role,
            question=request.question,
            sources=[],
            response_time_ms=response_time_ms,
            status="error"
        )
        
        logger.error(f"Query failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


# ❌ REMOVE THESE LINES - They should NOT be here
# app.include_router(query.router, tags=["Query"])
# app.include_router(ingest.router, tags=["Ingestion"])
# ... etc