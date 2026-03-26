import uuid

from app.database import Base
from sqlalchemy import Column, DateTime, Enum, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.sql import func


class Chat(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True))
    # validation check is done in db
    role = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    metadata_ = Column("metadata", JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
