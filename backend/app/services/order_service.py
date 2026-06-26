from sqlalchemy.orm import Session

from app import database_models
from app.utils.serializers import order_to_dict


def get_first_order(db: Session):
    return db.query(database_models.Orders).first()


def get_order_response(db: Session):
    order = get_first_order(db)
    if not order:
        return "Order not created yet"
    return order_to_dict(order)


def upsert_order_from_ai(db: Session, order_data: dict) -> None:
    existing_order = get_first_order(db)
    if existing_order:
        existing_order.status = order_data["status"]
        existing_order.total_amount = order_data["total_amount"]
        existing_order.customer = order_data["customer"]
        existing_order.order_items = order_data["order_items"]
    else:
        db.add(database_models.Orders(**order_data))


def delete_all_orders(db: Session) -> None:
    db.query(database_models.Orders).delete()
