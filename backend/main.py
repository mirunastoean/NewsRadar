from fastapi import FastAPI
import models
from database import engine

models.Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="NewsRadar API",
    description="API for NewsRadar application",
    version="1.0.0",
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the NewsRadar API!"}