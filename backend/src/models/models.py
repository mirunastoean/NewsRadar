from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
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
    source = Column(String)
    published_at = Column(DateTime, default=datetime.utcnow) 

class Source(Base):
    __tablename__ = "sources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String, unique=True, index=True)
    is_active = Column(Boolean, default=True)