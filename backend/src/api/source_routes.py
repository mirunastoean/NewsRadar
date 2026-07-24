from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from database import get_db
from src.models import models, schemas

router = APIRouter(
    prefix="/sources",
    tags=["Sources"]
)

@router.get("/", response_model=List[schemas.SourceResponse])
def get_sources(db: Session = Depends(get_db)):
    return db.query(models.Source).all()

@router.post("/", response_model=schemas.SourceResponse)
def create_source(source: schemas.SourceCreate, db: Session = Depends(get_db)):
    db_source = db.query(models.Source).filter(models.Source.url == source.url).first()
    if db_source:
        raise HTTPException(status_code=400, detail="Sursa cu acest URL există deja.")
    new_source = models.Source(name=source.name, url=source.url)
    db.add(new_source)
    db.commit()
    db.refresh(new_source)
    
    return new_source

@router.delete("/{source_id}")
def delete_source(source_id: int, db: Session = Depends(get_db)):
    source = db.query(models.Source).filter(models.Source.id == source_id).first()
    if not source:
        raise HTTPException(status_code=404, detail="Sursa nu a fost găsită")
    db.delete(source)
    db.commit()
    
    return {"message": "Sursa a fost ștearsă"}