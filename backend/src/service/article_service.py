from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session
from src.models import models, schemas
from src.utils.exceptions import ArticleAlreadyExistsError

def get_article_by_url(db: Session, url: str):
    return db.query(models.Article).filter(models.Article.url == url).first()

def create_article(db: Session, article: schemas.ArticleCreate):
    if get_article_by_url(db, article.url):
        raise ArticleAlreadyExistsError(detail=f"Articolul cu URL-ul '{article.url}' este deja salvat.")
    
    new_article = models.Article(
        title=article.title,
        url=article.url,
        content=article.content,
        source=article.source
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    return new_article

def get_articles(db: Session, skip: int = 0, limit: int = 100, search: Optional[str] = None):
    query = db.query(models.Article)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                models.Article.title.ilike(search_term),
                models.Article.source.ilike(search_term)
            )
        )
        
    return (
        query
        .order_by(models.Article.id.desc())  
        .offset(skip)
        .limit(limit)
        .all()
    )