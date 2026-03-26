from uuid import UUID

from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    id: UUID
    role: str
    content: str
