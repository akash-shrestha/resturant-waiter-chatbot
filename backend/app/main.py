import time
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()
class ChatRequest(BaseModel):
    message: str

@app.get("/")
def greet():
    return "Welcome from fastapi"

@app.post("/chat")
def LLMChat(request: ChatRequest):
    time.sleep(5)  # this is blocking approach
    print(request.message)
    reply = f"Hi you sent this message:  {request.message}"
    return reply




