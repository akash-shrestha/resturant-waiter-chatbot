from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.services.order_service import get_order_response

router = APIRouter(tags=["order"])


@router.get("/order")
def get_order(db: Session = Depends(get_db)):
    return get_order_response(db)
