# # api/routes/feedback.py

# from __future__ import annotations

# from typing import List, Literal, Optional

# from fastapi import APIRouter
# from pydantic import BaseModel

# from src.agent.tools.feedback_tool import FeedbackTool

# router = APIRouter(prefix="/feedback", tags=["feedback"])

# feedback_tool = FeedbackTool()  # logs to logs/feedback.jsonl by default


# class FeedbackRequest(BaseModel):
#     user_id: str
#     role: Literal["admin", "hr", "employee"]
#     question: str
#     answer: str
#     rating: int  # e.g. -1, 0, 1 or 1–5
#     comment: Optional[str] = None
#     context_sources: Optional[List[str]] = None


# @router.post("/")
# def submit_feedback(req: FeedbackRequest):
#     feedback_tool.submit(
#         user_id=req.user_id,
#         role=req.role,
#         question=req.question,
#         answer=req.answer,
#         rating=req.rating,
#         comment=req.comment,
#         context_sources=req.context_sources,
#     )
#     return {"status": "ok"}
# api/routes/feedback.py

from __future__ import annotations

from typing import Optional

import json
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(tags=["Feedback"])


class FeedbackRequest(BaseModel):
    user_id: str
    question_id: str
    rating: int  # 1-5
    comment: Optional[str] = ""


class FeedbackResponse(BaseModel):
    success: bool
    message: str


@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(request: FeedbackRequest) -> FeedbackResponse:
    """
    Submit user feedback for a response.
    Appends to logs/feedback.jsonl.
    """
    try:
        log_dir = Path("logs")
        log_dir.mkdir(exist_ok=True)

        feedback_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_id": request.user_id,
            "question_id": request.question_id,
            "rating": request.rating,
            "comment": request.comment,
        }

        feedback_file = log_dir / "feedback.jsonl"
        with feedback_file.open("a", encoding="utf-8") as f:
            f.write(json.dumps(feedback_entry, ensure_ascii=False) + "\n")

        return FeedbackResponse(
            success=True,
            message="Feedback submitted successfully",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))