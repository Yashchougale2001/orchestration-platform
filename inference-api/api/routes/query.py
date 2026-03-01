
# from typing import Any, List, Literal
# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel

# from src.agent.graph_agent import build_basic_hr_agent

# router = APIRouter(prefix="/query", tags=["query"])


# class QueryRequest(BaseModel):
#     question: str
#     user_id: str
#     role: Literal["admin", "hr", "employee"]


# class QueryResponse(BaseModel):
#     answer: str
#     steps: List[str]
#     context_sources: List[str]


# compiled_graph: Any = build_basic_hr_agent().compile()


# @router.post("/", response_model=QueryResponse)
# def query_chatbot(req: QueryRequest) -> QueryResponse:
#     try:
#         result = compiled_graph.invoke(
#             {
#                 "question": req.question,
#                 "user_id": req.user_id,
#                 "role": req.role,
#             }
#         ) or {}

#         answer = result.get("answer") or ""
#         steps = result.get("steps") or []
#         context = result.get("context") or []

#         sources = [
#             d.get("metadata", {}).get("source", "unknown")
#             for d in context
#         ]

#         return QueryResponse(
#             answer=answer,
#             steps=steps,
#             context_sources=sorted(set(sources)),
#         )
#     except Exception:
#         raise HTTPException(status_code=500, detail="Internal server error")
# api/routes/query.py

from __future__ import annotations

from typing import Any, List, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src.agent.graph_agent import build_basic_hr_agent

router = APIRouter()

RoleLiteral = Literal["admin", "hr", "employee"]


class QueryRequest(BaseModel):
    question: str
    user_id: str
    role: RoleLiteral  # "admin", "hr", or "employee"


class QueryResponse(BaseModel):
    answer: str
    steps: List[str] = []
    context_sources: List[str] = []


# Compile LangGraph agent once
compiled_graph: Any = build_basic_hr_agent().compile()


@router.post("/query", response_model=QueryResponse)
async def query_endpoint(request: QueryRequest) -> QueryResponse:
    """
    Main query endpoint for the RAG chatbot.
    """
    try:
        result = compiled_graph.invoke(
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
            }
        )

        return QueryResponse(
            answer=answer,
            steps=steps,
            context_sources=sources,
        )

    except Exception:
        # Avoid leaking internal errors to client
        raise HTTPException(status_code=500, detail="Internal server error")