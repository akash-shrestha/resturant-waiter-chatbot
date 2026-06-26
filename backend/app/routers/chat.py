from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services import chat_service

router = APIRouter(tags=["chat"])


@router.get("/chat", response_model=list[ChatResponse])
def get_chat(db: Session = Depends(get_db)):
    return chat_service.get_chat_history(db)


@router.post("/chat")
def post_chat(request: ChatRequest, db: Session = Depends(get_db)):
    return chat_service.send_chat_message(db, request.message)


@router.delete("/chat")
def delete_chat(db: Session = Depends(get_db)):
    return chat_service.clear_chat_history(db)
