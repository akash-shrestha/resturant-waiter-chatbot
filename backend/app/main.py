from app import database_models
from app.database import engine
from app.routers import chat, order
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://resturant-waiter-chatbot-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_tables() -> None:
    database_models.Base.metadata.create_all(bind=engine)


app.include_router(chat.router)
app.include_router(order.router)


@app.get("/")
def greet():
    return "Welcome from fastapi"
