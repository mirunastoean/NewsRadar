from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ArticleBase(BaseModel):
    title: str
    url: str
    content: Optional[str] = None
    source: str

class ArticleCreate(ArticleBase):
    pass

class ArticleResponse(ArticleBase):
    id: int
    published_at: datetime

    class Config:
        from_attributes = True

class SourceCreate(BaseModel):
    name: str
    url: str

class SourceResponse(BaseModel):
    id: int
    name: str
    url: str
    is_active: bool

    class Config:
        from_attributes = True