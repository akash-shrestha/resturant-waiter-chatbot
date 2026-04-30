# import time
from app import database_models
from app.ai_service import ask_ai
from app.database import SessionLocal
from app.models import ChatRequest, ChatResponse
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

app = FastAPI()

# inspect all models and create the corresponding tables in db that do no exist
# database_models.Base.metadata.create_all(bind=engine)


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
        database_models.Chat.id, database_models.Chat.role, database_models.Chat.content
    ).all()
    response: list[ChatResponse] = []
    for message in db_chat:
        response.append(
            {"id": str(message.id), "role": message.role, "content": message.content}
        )

    return response


@app.post("/chat")
def llm_chat(request: ChatRequest, db: Session = Depends(get_db)):
    # time.sleep(5)  # this is blocking approach
    # print(request.message)
    # print(request.message)
    # print(ask_ai("hi"))
    new_user_message = database_models.Chat(
        conversation_id="3f7a9c2e-6b4d-4d91-9f3c-8a2e5b7d1c4f",
        role="user",
        content=request.message,
    )
    db.add(new_user_message)
    db.commit()
    db_chat = db.query(database_models.Chat.role, database_models.Chat.content).all()
    chat_json = []
    for message in db_chat:
        chat_json.append({"role": message.role, "content": message.content})
    existing_order = db.query(database_models.Orders).first()
    existing_order_data = None
    if existing_order:
        # turning the SQLAlchemy ORM object into a plain Python dict or JSON-friendly representation of that object
        existing_order_data = {
            "order_id": existing_order.order_id,
            "status": existing_order.status,
            "created_at": existing_order.created_at.isoformat()
            if existing_order.created_at
            else None,
            "total_amount": str(existing_order.total_amount),
            "customer": existing_order.customer,
            "order_items": existing_order.order_items,
        }
    ai_reply = ask_ai(chat_json, existing_order_data)
    ai_user_response = ai_reply["user_reply"]
    new_ai_message = database_models.Chat(
        conversation_id="3f7a9c2e-6b4d-4d91-9f3c-8a2e5b7d1c4f",
        role="assistant",
        content=ai_user_response,
    )
    db.add(new_ai_message)
    order_data = ai_reply["order_status"]
    if existing_order:
        existing_order.status = order_data["status"]
        existing_order.total_amount = order_data["total_amount"]
        existing_order.customer = order_data["customer"]
        existing_order.order_items = order_data["order_items"]
    else:
        new_order = database_models.Orders(**order_data)
        db.add(new_order)
    db.commit()
    reply = f" {ai_user_response}"

    return reply


@app.delete("/chat")
def delete_chat(db: Session = Depends(get_db)):
    deleted_count = db.query(database_models.Chat).delete()
    db.commit()
    response = f"deleted {deleted_count} messages successfully"

    return response
