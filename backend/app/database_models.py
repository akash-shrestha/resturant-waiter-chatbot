import uuid

from app.database import Base
from sqlalchemy import Column, DateTime, Numeric, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.sql import func


class Chat(Base):
    __tablename__ = "messages"

    # as_uuid=True means SQLAlchemy will treat that UUID column as a Python uuid.UUID object instead of a plain string.
    # default tells database to automatically generate a unique ID if you don't provide one
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True))
    # validation check is done in db
    role = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    metadata_ = Column("metadata", JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Orders(Base):
    __tablename__ = "orders"

    order_id = Column(Text, nullable=False, unique=True, primary_key=True)
    status = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    total_amount = Column(Numeric(10, 2), nullable=False)
    customer = Column(JSONB)
    order_items = Column(JSONB)
