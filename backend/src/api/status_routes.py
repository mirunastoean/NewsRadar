import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from confluent_kafka.admin import AdminClient

# Importurile tale existente
from database import get_db
from src.models.models import Article

router = APIRouter(
    prefix="/status",
    tags=["Status"]
)

def check_kafka_status():
    """Verifică dacă brokerul Kafka răspunde."""
    try:
        bootstrap_servers = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
        admin = AdminClient({'bootstrap.servers': bootstrap_servers})
        metadata = admin.list_topics(timeout=2)
        if metadata:
            return "Online"
    except Exception as e:
        print(f"Eroare verificare Kafka: {e}")
    return "Offline"

@router.get("/")
def get_system_status(db: Session = Depends(get_db)):
    total_articles = db.query(Article).count()
    

    try:
        timp_24h_in_urma = datetime.utcnow() - timedelta(hours=24)
        articles_today = db.query(Article).filter(Article.published_at >= timp_24h_in_urma).count()
    except AttributeError:
        articles_today = 0
    
    active_sources = db.query(Article.source).distinct().count()
    
    return {
        "totalArticles": total_articles,
        "articlesToday": articles_today,
        "activeSources": active_sources,
        "lastSync": datetime.utcnow().isoformat(),
        "kafkaStatus": check_kafka_status()
    }