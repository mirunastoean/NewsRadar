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

def get_articles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Article).offset(skip).limit(limit).all()