# import time
from fastapi import FastAPI
from app.ai_service import ask_ai
from app.models import ChatRequest

app = FastAPI()

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




