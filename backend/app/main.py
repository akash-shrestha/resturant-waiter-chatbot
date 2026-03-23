# import time
from fastapi import FastAPI
from pydantic import BaseModel
from app.ai_service import ask_ai

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def greet():
    return "Welcome from fastapi"

@app.post("/chat")
def llm_chat(request: ChatRequest):
    # time.sleep(5)  # this is blocking approach
    # print(request.message)
    # print(request.message)
    # print(ask_ai("hi"))
    ai_response  = ask_ai(request.message)
    reply = f" {ai_response}"
    return reply




