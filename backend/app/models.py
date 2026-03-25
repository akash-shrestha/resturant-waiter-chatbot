from pydantic import BaseModel
from uuid import UUID

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    id: UUID
    role: str
    content: str