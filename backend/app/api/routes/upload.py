import os
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.core.config import settings
from app.schemas.document import UploadResponse
from app.services.document_service import extract_text, DocumentExtractionError
from app.services.chunking_service import chunk_text
from app.services.embedding_service import embed_chunks
from app.services.vector_store import reset_collection, add_chunks

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".txt"}


@router.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Only .pdf and .txt are allowed.",
        )

    content = await file.read()

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    os.makedirs(settings.upload_dir, exist_ok=True)
    unique_name = f"{uuid.uuid4()}{ext}"
    save_path = os.path.join(settings.upload_dir, unique_name)

    with open(save_path, "wb") as f:
        f.write(content)

    try:
        extracted_text = extract_text(save_path, ext)
    except DocumentExtractionError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        chunks = chunk_text(extracted_text)
        chunks = embed_chunks(chunks)
        reset_collection()
        add_chunks(chunks)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process document into the vector store: {e}",
        )

    return UploadResponse(
        filename=filename,
        file_type=ext,
        size_bytes=len(content),
        character_count=len(extracted_text),
        text_preview=extracted_text[:300],
        message=f"File uploaded and processed successfully into {len(chunks)} chunks.",
    )