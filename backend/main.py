from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from database import engine
from src.models import models
from src.api import article_routes
from src.utils.exceptions import ArticleAlreadyExistsError
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NewsRadar API",
    description="Backend-ul pentru platforma de colectare si analiza a stirilor",
    version="1.1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.exception_handler(ArticleAlreadyExistsError)
async def article_exists_exception_handler(request: Request, exc: ArticleAlreadyExistsError):
    return JSONResponse(
        status_code=400,
        content={"message": "Eroare de validare", "detalii": exc.detail},
    )

app.include_router(article_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the NewsRadar API!"}