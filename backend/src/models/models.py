from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
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

class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)