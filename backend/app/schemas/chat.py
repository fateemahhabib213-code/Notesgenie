from pydantic import BaseModel


class AskRequest(BaseModel):
    question: str


class SourceChunk(BaseModel):
    chunk_id: int
    content: str
    score: float


class AskResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]