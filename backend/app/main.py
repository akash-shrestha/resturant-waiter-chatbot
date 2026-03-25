# import time
from fastapi import FastAPI, Depends
from app.ai_service import ask_ai
from app.models import ChatRequest
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

@app.get("/chat")
def get_chat(db: Session = Depends(get_db)):
    db_chat = db.query(database_models.Chat).all()
    for message in db_chat:
        print(message.__dict__)
    return "db chat logged"

@app.post("/chat")
def llm_chat(request: ChatRequest):
    # time.sleep(5)  # this is blocking approach
    # print(request.message)
    # print(request.message)
    # print(ask_ai("hi"))
    ai_response  = ask_ai(request.message)
    reply = f" {ai_response}"
    return reply




