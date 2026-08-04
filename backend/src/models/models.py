from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, JSON
from datetime import datetime

try:
    from database import Base
except ModuleNotFoundError:
    from backend.database import Base

class Article(Base):
    __tablename__ = "articles" 
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    url = Column(String, unique=True, index=True) 
    content = Column(Text, nullable=True)
    source = Column(String, nullable=True)
    published_at = Column(DateTime, default=datetime.now) 
    summary = Column(Text, nullable=True)
    sentiment = Column(String, nullable=True)
    category = Column(String, nullable=True)
    entities = Column(JSON, nullable=True) 

class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)