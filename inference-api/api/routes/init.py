# api/routes/__init__.py

from api.routes import query
from api.routes import ingest
from api.routes import feedback
from api.routes import admin

__all__ = ["query", "ingest", "feedback", "admin"]