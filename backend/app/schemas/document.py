from pydantic import BaseModel


class UploadResponse(BaseModel):
    filename: str
    file_type: str
    size_bytes: int
    character_count: int
    text_preview: str
    message: str