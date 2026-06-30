from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from src.models import schemas
from src.service import article_service
from database import get_db


router = APIRouter(
    prefix="/articles",
    tags=["Articles"]
)

@router.post("/", response_model=schemas.ArticleResponse)
def create_article(article: schemas.ArticleCreate, db: Session = Depends(get_db)):
    return article_service.create_article(db=db, article=article)

@router.get("/", response_model=List[schemas.ArticleResponse])
def read_articles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return article_service.get_articles(db=db, skip=skip, limit=limit)