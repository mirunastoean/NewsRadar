from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="NewsRadar API",
    description="Backend-ul pentru platforma de colectare si analiza a stirilor",
    version="1.0.0",
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the NewsRadar API!"}

#adaugarea unui articol
@app.post("/articles/", response_model=schemas.ArticleResponse)
def create_article(article: schemas.ArticleCreate, db: Session = Depends(get_db)):
    #verificam daca exista deja un articol cu acest url
    db_article = db.query(models.Article).filter(models.Article.url == article.url).first()
    if db_article:
        raise HTTPException(status_code=400, detail="Acest articol exista deja in baza de date (url duplicat)")
    #daca nu exista, il cream
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

#citirea tuturor articolelor
@app.get("/articles/", response_model=list[schemas.ArticleResponse])
def read_articles(skip: int =  0, limit: int = 100, db: Session = Depends(get_db)):
    articles = db.query(models.Article).offset(skip).limit(limit).all()
    return articles
