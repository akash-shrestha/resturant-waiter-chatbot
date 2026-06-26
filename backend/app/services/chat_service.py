from sqlalchemy.orm import Session

from app import database_models
from app.ai_service import ask_ai
from app.constants import CONVERSATION_ID
from app.schemas.chat import ChatResponse
from app.services.order_service import delete_all_orders, get_first_order, upsert_order_from_ai
from app.utils.serializers import order_to_dict


def get_chat_history(db: Session) -> list[ChatResponse]:
    db_chat = db.query(
        database_models.Chat.id, database_models.Chat.role, database_models.Chat.content
    ).all()
    return [
        ChatResponse(id=message.id, role=message.role, content=message.content)
        for message in db_chat
    ]


def send_chat_message(db: Session, message: str) -> str:
    db.add(
        database_models.Chat(
            conversation_id=CONVERSATION_ID,
            role="user",
            content=message,
        )
    )
    db.commit()

    db_chat = db.query(database_models.Chat.role, database_models.Chat.content).all()
    chat_json = [{"role": msg.role, "content": msg.content} for msg in db_chat]

    existing_order = get_first_order(db)
    existing_order_data = order_to_dict(existing_order) if existing_order else None

    ai_reply = ask_ai(chat_json, existing_order_data)
    ai_user_response = ai_reply["user_reply"]

    db.add(
        database_models.Chat(
            conversation_id=CONVERSATION_ID,
            role="assistant",
            content=ai_user_response,
        )
    )
    upsert_order_from_ai(db, ai_reply["order_status"])
    db.commit()

    return ai_user_response


def clear_chat_history(db: Session) -> str:
    messages_deleted_count = db.query(database_models.Chat).delete()
    delete_all_orders(db)
    db.commit()
    return f"deleted {messages_deleted_count} messages & order details successfully"
