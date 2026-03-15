from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def greet():
    return "Welcome from fastapi"

@app.post("/chat")
def LLMChat(message: str):
    reply = f"Hi you sent this message:  {message}"
    return reply




