from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
from datetime import datetime

class Article(Base):
    __tablename__ = "articles" 
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    url = Column(String, unique=True, index=True) 
    content = Column(Text, nullable=True)
    source = Column(String)
    published_at = Column(DateTime, default=datetime.utcnow) 