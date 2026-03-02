# api/routes/admin.py

from __future__ import annotations

import json
import os
import re
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional
from collections import Counter

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["Admin"])

# ============================================================================
# Response Models
# ============================================================================

class StatsResponse(BaseModel):
    total_queries: int
    total_documents: int
    total_chunks: int
    active_users: int
    avg_response_time: str
    queries_today: int
    queries_this_week: List[int]  # Last 7 days
    ingestions_today: int


class TopSourceItem(BaseModel):
    name: str
    count: int
    percentage: float


class TopSourcesResponse(BaseModel):
    sources: List[TopSourceItem]


class LogEntry(BaseModel):
    id: int
    timestamp: str
    level: str
    message: str
    user: Optional[str] = "system"
    module: Optional[str] = None


class LogsResponse(BaseModel):
    logs: List[LogEntry]
    total: int
    page: int
    page_size: int


class UserActivity(BaseModel):
    user_id: str
    role: str
    query_count: int
    last_active: str


class ActiveUsersResponse(BaseModel):
    users: List[UserActivity]
    total: int


class QueryLogEntry(BaseModel):
    id: int
    timestamp: str
    user_id: str
    role: str
    question: str
    response_time_ms: int
    sources_used: List[str]
    status: str


class QueryLogsResponse(BaseModel):
    queries: List[QueryLogEntry]
    total: int


class FeedbackSummary(BaseModel):
    total_feedback: int
    average_rating: float
    rating_distribution: Dict[int, int]  # {1: count, 2: count, ...}
    recent_feedback: List[Dict[str, Any]]


# ============================================================================
# Helper Functions
# ============================================================================

def get_log_directory() -> Path:
    """Get the logs directory path."""
    return Path("logs")


def get_data_directory() -> Path:
    """Get the data directory path."""
    return Path("data")


def get_db_directory() -> Path:
    """Get the database directory path."""
    return Path("db")


def parse_log_line(line: str, line_id: int) -> Optional[LogEntry]:
    """
    Parse a single log line into LogEntry.
    Expected format: 2024-01-15 10:30:45,123 - module_name - LEVEL - message
    """
    try:
        # Common log format pattern
        pattern = r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3})\s*-\s*(\w+)\s*-\s*(\w+)\s*-\s*(.+)'
        match = re.match(pattern, line.strip())
        
        if match:
            timestamp_str, module, level, message = match.groups()
            
            # Extract user from message if present
            user = "system"
            user_match = re.search(r'user[_\s]?(?:id)?[:\s=]+["\']?(\w+)["\']?', message, re.IGNORECASE)
            if user_match:
                user = user_match.group(1)
            
            return LogEntry(
                id=line_id,
                timestamp=timestamp_str,
                level=level.upper(),
                message=message[:200],  # Truncate long messages
                user=user,
                module=module
            )
        
        # Fallback: simple parsing
        parts = line.strip().split(' - ', 3)
        if len(parts) >= 4:
            return LogEntry(
                id=line_id,
                timestamp=parts[0],
                level=parts[2].upper() if len(parts) > 2 else "INFO",
                message=parts[3][:200] if len(parts) > 3 else line[:200],
                user="system",
                module=parts[1] if len(parts) > 1 else None
            )
        
        return None
    except Exception:
        return None


def read_log_file(file_path: Path, max_lines: int = 1000) -> List[str]:
    """Read last N lines from a log file."""
    if not file_path.exists():
        return []
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
            return lines[-max_lines:]
    except Exception:
        return []


def read_jsonl_file(file_path: Path) -> List[Dict[str, Any]]:
    """Read all entries from a JSONL file."""
    if not file_path.exists():
        return []
    
    entries = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        entries.append(json.loads(line))
                    except json.JSONDecodeError:
                        continue
    except Exception:
        pass
    
    return entries


def get_chroma_stats() -> Dict[str, int]:
    """Get statistics from ChromaDB."""
    try:
        from src.db.chroma_client import get_chroma_client
        
        client = get_chroma_client()
        collections = client.list_collections()
        
        total_documents = 0
        total_chunks = 0
        
        for collection in collections:
            col = client.get_collection(collection.name)
            count = col.count()
            total_chunks += count
            
            # Estimate documents (assuming avg 10 chunks per doc)
            # You can improve this by tracking actual document count
            total_documents += max(1, count // 10)
        
        return {
            "total_documents": total_documents,
            "total_chunks": total_chunks
        }
    except Exception as e:
        print(f"Error getting Chroma stats: {e}")
        return {"total_documents": 0, "total_chunks": 0}


def get_query_stats_from_logs() -> Dict[str, Any]:
    """Extract query statistics from log files."""
    log_dir = get_log_directory()
    app_log = log_dir / "app.log"
    
    lines = read_log_file(app_log, max_lines=5000)
    
    total_queries = 0
    response_times = []
    queries_by_day = Counter()
    users = set()
    sources_counter = Counter()
    
    today = datetime.now().date()
    
    for line in lines:
        # Count queries
        if '/query' in line and 'POST' in line:
            total_queries += 1
            
            # Extract date
            date_match = re.search(r'(\d{4}-\d{2}-\d{2})', line)
            if date_match:
                log_date = datetime.strptime(date_match.group(1), '%Y-%m-%d').date()
                queries_by_day[log_date] += 1
        
        # Extract response times
        time_match = re.search(r'response[_\s]?time[:\s=]+(\d+(?:\.\d+)?)\s*(?:ms|s)?', line, re.IGNORECASE)
        if time_match:
            rt = float(time_match.group(1))
            response_times.append(rt)
        
        # Extract users
        user_match = re.search(r'user[_\s]?id[:\s=]+["\']?(\w+)["\']?', line, re.IGNORECASE)
        if user_match:
            users.add(user_match.group(1))
        
        # Extract sources
        source_match = re.search(r'source[:\s=]+["\']?([^"\']+)["\']?', line, re.IGNORECASE)
        if source_match:
            sources_counter[source_match.group(1)] += 1
    
    # Calculate queries for last 7 days
    queries_this_week = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        queries_this_week.append(queries_by_day.get(day, 0))
    
    # Calculate average response time
    avg_response_time = "N/A"
    if response_times:
        avg_rt = sum(response_times) / len(response_times)
        if avg_rt > 1000:
            avg_response_time = f"{avg_rt/1000:.1f}s"
        else:
            avg_response_time = f"{avg_rt:.0f}ms"
    
    return {
        "total_queries": total_queries,
        "queries_today": queries_by_day.get(today, 0),
        "queries_this_week": queries_this_week,
        "avg_response_time": avg_response_time,
        "active_users": len(users),
        "top_sources": sources_counter.most_common(10)
    }


def get_memory_users() -> List[Dict[str, Any]]:
    """Get active users from memory files."""
    log_dir = get_log_directory()
    memory_dir = log_dir / "memory"
    
    users = []
    
    if not memory_dir.exists():
        # Try alternative locations
        for alt_path in [Path("memory"), Path("data/memory"), log_dir]:
            if alt_path.exists():
                memory_dir = alt_path
                break
    
    if memory_dir.exists():
        for file_path in memory_dir.glob("*.json"):
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    user_id = file_path.stem
                    users.append({
                        "user_id": user_id,
                        "role": data.get("role", "unknown"),
                        "query_count": len(data.get("history", [])),
                        "last_active": data.get("last_active", "unknown")
                    })
            except Exception:
                continue
    
    return users


# ============================================================================
# API Endpoints
# ============================================================================

@router.get("/stats", response_model=StatsResponse)
async def get_admin_stats() -> StatsResponse:
    """
    Get overall system statistics for the admin dashboard.
    """
    try:
        # Get ChromaDB stats
        chroma_stats = get_chroma_stats()
        
        # Get query stats from logs
        query_stats = get_query_stats_from_logs()
        
        # Get ingestion count from logs
        log_dir = get_log_directory()
        ingest_log = log_dir / "ingestion.log"
        ingestions_today = 0
        
        if ingest_log.exists():
            today_str = datetime.now().strftime('%Y-%m-%d')
            lines = read_log_file(ingest_log, max_lines=500)
            ingestions_today = sum(1 for line in lines if today_str in line and 'success' in line.lower())
        
        return StatsResponse(
            total_queries=query_stats["total_queries"],
            total_documents=chroma_stats["total_documents"],
            total_chunks=chroma_stats["total_chunks"],
            active_users=query_stats["active_users"],
            avg_response_time=query_stats["avg_response_time"],
            queries_today=query_stats["queries_today"],
            queries_this_week=query_stats["queries_this_week"],
            ingestions_today=ingestions_today
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")


@router.get("/top-sources", response_model=TopSourcesResponse)
async def get_top_sources(limit: int = Query(default=10, le=50)) -> TopSourcesResponse:
    """
    Get top document sources used in queries.
    """
    try:
        query_stats = get_query_stats_from_logs()
        top_sources = query_stats.get("top_sources", [])
        
        total = sum(count for _, count in top_sources)
        
        sources = [
            TopSourceItem(
                name=name,
                count=count,
                percentage=round((count / total * 100) if total > 0 else 0, 1)
            )
            for name, count in top_sources[:limit]
        ]
        
        return TopSourcesResponse(sources=sources)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get top sources: {str(e)}")


@router.get("/logs", response_model=LogsResponse)
async def get_system_logs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=50, le=200),
    level: Optional[str] = Query(default=None, description="Filter by log level: INFO, WARNING, ERROR"),
    search: Optional[str] = Query(default=None, description="Search in log messages")
) -> LogsResponse:
    """
    Get system logs with pagination and filtering.
    """
    try:
        log_dir = get_log_directory()
        app_log = log_dir / "app.log"
        
        lines = read_log_file(app_log, max_lines=2000)
        
        # Parse all log lines
        all_logs = []
        for idx, line in enumerate(reversed(lines)):  # Most recent first
            entry = parse_log_line(line, idx + 1)
            if entry:
                # Apply filters
                if level and entry.level != level.upper():
                    continue
                if search and search.lower() not in entry.message.lower():
                    continue
                all_logs.append(entry)
        
        # Pagination
        total = len(all_logs)
        start = (page - 1) * page_size
        end = start + page_size
        paginated_logs = all_logs[start:end]
        
        return LogsResponse(
            logs=paginated_logs,
            total=total,
            page=page,
            page_size=page_size
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get logs: {str(e)}")


@router.get("/active-users", response_model=ActiveUsersResponse)
async def get_active_users() -> ActiveUsersResponse:
    """
    Get list of active users with their activity stats.
    """
    try:
        # Get users from memory
        memory_users = get_memory_users()
        
        # Also check query logs for additional users
        query_stats = get_query_stats_from_logs()
        
        # Combine and deduplicate
        users_dict = {}
        
        for user in memory_users:
            users_dict[user["user_id"]] = UserActivity(
                user_id=user["user_id"],
                role=user["role"],
                query_count=user["query_count"],
                last_active=user["last_active"]
            )
        
        users_list = list(users_dict.values())
        
        # Sort by query count (most active first)
        users_list.sort(key=lambda x: x.query_count, reverse=True)
        
        return ActiveUsersResponse(
            users=users_list,
            total=len(users_list)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get active users: {str(e)}")


@router.get("/feedback-summary", response_model=FeedbackSummary)
async def get_feedback_summary() -> FeedbackSummary:
    """
    Get summary of user feedback.
    """
    try:
        log_dir = get_log_directory()
        feedback_file = log_dir / "feedback.jsonl"
        
        feedback_entries = read_jsonl_file(feedback_file)
        
        if not feedback_entries:
            return FeedbackSummary(
                total_feedback=0,
                average_rating=0.0,
                rating_distribution={1: 0, 2: 0, 3: 0, 4: 0, 5: 0},
                recent_feedback=[]
            )
        
        # Calculate stats
        ratings = [entry.get("rating", 0) for entry in feedback_entries if entry.get("rating")]
        
        rating_distribution = Counter(ratings)
        # Ensure all ratings 1-5 are present
        for i in range(1, 6):
            if i not in rating_distribution:
                rating_distribution[i] = 0
        
        avg_rating = sum(ratings) / len(ratings) if ratings else 0.0
        
        # Get recent feedback (last 10)
        recent = feedback_entries[-10:]
        recent.reverse()  # Most recent first
        
        return FeedbackSummary(
            total_feedback=len(feedback_entries),
            average_rating=round(avg_rating, 2),
            rating_distribution=dict(rating_distribution),
            recent_feedback=recent
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get feedback summary: {str(e)}")


@router.get("/query-logs", response_model=QueryLogsResponse)
async def get_query_logs(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, le=100),
    user_id: Optional[str] = Query(default=None)
) -> QueryLogsResponse:
    """
    Get detailed query logs.
    """
    try:
        log_dir = get_log_directory()
        query_log = log_dir / "queries.jsonl"
        
        entries = read_jsonl_file(query_log)
        
        # Filter by user if specified
        if user_id:
            entries = [e for e in entries if e.get("user_id") == user_id]
        
        # Sort by timestamp (most recent first)
        entries.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
        
        # Pagination
        total = len(entries)
        start = (page - 1) * page_size
        end = start + page_size
        paginated = entries[start:end]
        
        query_logs = [
            QueryLogEntry(
                id=idx + start + 1,
                timestamp=entry.get("timestamp", ""),
                user_id=entry.get("user_id", "unknown"),
                role=entry.get("role", "unknown"),
                question=entry.get("question", "")[:100],
                response_time_ms=entry.get("response_time_ms", 0),
                sources_used=entry.get("sources", []),
                status=entry.get("status", "success")
            )
            for idx, entry in enumerate(paginated)
        ]
        
        return QueryLogsResponse(
            queries=query_logs,
            total=total
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get query logs: {str(e)}")