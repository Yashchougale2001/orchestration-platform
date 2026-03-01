# from fastapi import APIRouter, UploadFile, File, Form, HTTPException
# from pydantic import BaseModel
# from pathlib import Path
# import shutil
# import os

# from src.utils.config_loader import load_paths
# from src.ingestion.ingest_pipeline import IngestionPipeline

# router = APIRouter(prefix="/ingest", tags=["ingest"])

# pipeline = IngestionPipeline()


# class IngestResponse(BaseModel):
#     status: str
#     count: int


# @router.post("/file", response_model=IngestResponse)
# async def ingest_file(
#     file: UploadFile = File(...),
#     dataset: str = Form("default"),
# ):
#     try:
#         paths = load_paths()
#         tmp_dir = Path(paths.get("tmp_dir", "data/tmp"))
#         tmp_dir.mkdir(parents=True, exist_ok=True)
#         dest = tmp_dir / file.filename
#         with dest.open("wb") as f:
#             shutil.copyfileobj(file.file, f)

#         res = pipeline.ingest(str(dest), dataset_name=dataset)
#         return IngestResponse(status=res.get("status", "ok"), count=res.get("count", 0))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/url", response_model=IngestResponse)
# async def ingest_url(url: str, dataset: str = "default"):
#     try:
#         res = pipeline.ingest(url, dataset_name=dataset)
#         return IngestResponse(status=res.get("status", "ok"), count=res.get("count", 0))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
    
# @router.post("/folder", response_model=IngestResponse)
# async def ingest_folder(path: str, dataset: str = "default"):
#     """
#     Ingest all files in a local folder (recursively).

#     NOTE: 'path' is a server-side local path (e.g. 'data/hr_policies'),
#     not a path on the client machine.
#     """
#     try:
#         if not os.path.isdir(path):
#             raise HTTPException(status_code=400, detail=f"'{path}' is not a directory or does not exist")

#         total_chunks = 0
#         # Walk folder recursively and ingest each file
#         for root, dirs, files in os.walk(path):
#             for fname in files:
#                 fpath = os.path.join(root, fname)
#                 res = pipeline.ingest(fpath, dataset_name=dataset)
#                 total_chunks += res.get("count", 0)

#         return IngestResponse(status="ok", count=total_chunks)
#     except HTTPException:
#         # re-raise FastAPI HTTP errors as-is
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
# api/routes/ingest.py

from __future__ import annotations

from typing import Optional

import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

from src.ingestion.ingest_pipeline import IngestionPipeline

router = APIRouter(prefix="/ingest", tags=["Ingestion"])

pipeline = IngestionPipeline()


class FolderIngestRequest(BaseModel):
    folder_path: str
    dataset: Optional[str] = "default"


class UrlIngestRequest(BaseModel):
    url: str
    dataset: Optional[str] = "default"


class IngestResponse(BaseModel):
    success: bool
    message: str
    chunks_created: int = 0


@router.post("/file", response_model=IngestResponse)
async def ingest_file(
    file: UploadFile = File(...),
    dataset: str = "default",
) -> IngestResponse:
    """
    Ingest a single uploaded file into the specified dataset.
    """
    try:
        # Save uploaded file temporarily
        suffix = Path(file.filename).suffix or ""
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Process the file via IngestionPipeline
        result = pipeline.ingest(path_or_url=tmp_path, dataset_name=dataset)

        # Clean up
        try:
            os.unlink(tmp_path)
        except Exception:
            pass

        return IngestResponse(
            success=True,
            message=f"File '{file.filename}' ingested successfully into dataset '{dataset}'",
            chunks_created=result.get("count", 0),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/folder", response_model=IngestResponse)
async def ingest_folder(request: FolderIngestRequest) -> IngestResponse:
    """
    Ingest all supported files from a folder (recursively).
    """
    try:
        folder = Path(request.folder_path)
        if not folder.exists() or not folder.is_dir():
            raise HTTPException(status_code=400, detail="Folder path does not exist or is not a directory")

        total_chunks = 0
        # Recursively ingest all files
        for path in folder.rglob("*"):
            if not path.is_file():
                continue
            res = pipeline.ingest(str(path), dataset_name=request.dataset or "default")
            total_chunks += res.get("count", 0)

        return IngestResponse(
            success=True,
            message=f"Folder '{request.folder_path}' ingested successfully into dataset '{request.dataset}'",
            chunks_created=total_chunks,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/url", response_model=IngestResponse)
async def ingest_url(request: UrlIngestRequest) -> IngestResponse:
    """
    Ingest a document from a URL.
    """
    try:
        result = pipeline.ingest(
            path_or_url=request.url,
            dataset_name=request.dataset or "default",
        )

        return IngestResponse(
            success=True,
            message=f"URL '{request.url}' ingested successfully into dataset '{request.dataset}'",
            chunks_created=result.get("count", 0),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))