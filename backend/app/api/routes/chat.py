from fastapi import APIRouter, HTTPException

from app.schemas.chat import AskRequest, AskResponse
from app.services.rag_service import answer_question
from app.services.vector_store import get_collection

router = APIRouter()


@router.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest):
    question = request.question.strip()

    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    collection = get_collection()
    if collection.count() == 0:
        raise HTTPException(
            status_code=400,
            detail="No document has been uploaded yet. Please upload a document first.",
        )

    try:
        result = answer_question(question)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate an answer: {e}",
        )

    return AskResponse(**result)