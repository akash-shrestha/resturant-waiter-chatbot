# import time
from fastapi import FastAPI, Depends
from app.ai_service import ask_ai
from app.models import ChatRequest, ChatResponse
from app import database_models
from app.database import SessionLocal, engine
from sqlalchemy.orm import Session

app = FastAPI()

database_models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def greet():

    return "Welcome from fastapi"

@app.get("/chat", response_model=list[ChatResponse])
def get_chat(db: Session = Depends(get_db)):
    db_chat = db.query(
        database_models.Chat.id,
        database_models.Chat.role,
        database_models.Chat.content
        ).all()
    response: list[ChatResponse] = []
    for message in db_chat:
        response.append(
            {
                "id": str(message.id),
                "role": message.role,
                "content": message.content
            }
        )

    return response

@app.post("/chat")
def llm_chat(request: ChatRequest, db: Session = Depends(get_db)):
    # time.sleep(5)  # this is blocking approach
    # print(request.message)
    # print(request.message)
    # print(ask_ai("hi"))
    new_user_message = database_models.Chat(
        role="user",
        content=request.message
        )
    db.add(new_user_message)
    ai_response  = ask_ai(request.message)
    new_ai_message = database_models.Chat(
        role = "assistant",
        content=ai_response
    )
    db.add(new_ai_message)
    db.commit()
    reply = f" {ai_response}"

    return reply




