import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date 
from confluent_kafka.admin import AdminClient
from database import get_db
from src.models.models import Article, Source

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
        timp_24h_in_urma = datetime.now() - timedelta(hours=24)
        articles_today = db.query(Article).filter(Article.published_at >= timp_24h_in_urma).count()
    except AttributeError:
        articles_today = 0
    active_sources = db.query(Source).count() 
    
    return {
        "totalArticles": total_articles,
        "articlesToday": articles_today,
        "activeSources": active_sources,
        "lastSync": datetime.now().isoformat(), 
        "kafkaStatus": check_kafka_status()
    }

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    sentiment_distribution_raw = (
        db.query(Article.sentiment, func.count(Article.id))
        .group_by(Article.sentiment)
        .all()
    )
    sentiment_distribution = [{"sentiment": item[0] or "Neprocesat", "count": item[1]} for item in sentiment_distribution_raw]

    seven_days_ago = datetime.now() - timedelta(days=7)
    daily_activity_raw = (
        db.query(cast(Article.published_at, Date), func.count(Article.id))
        .filter(Article.published_at >= seven_days_ago)
        .group_by(cast(Article.published_at, Date))
        .order_by(cast(Article.published_at, Date))
        .all()
    )
    daily_activity = [{"date": item[0].strftime("%Y-%m-%d"), "count": item[1]} for item in daily_activity_raw if item[0]]
    category_distribution_raw = (
        db.query(Article.category, func.count(Article.id))
        .group_by(Article.category)
        .all()
    )
    category_distribution = [{"category": item[0] or "Necategorizat", "count": item[1]} for item in category_distribution_raw]
    top_sources_raw = (
        db.query(Article.source, func.count(Article.id))
        .group_by(Article.source)
        .order_by(func.count(Article.id).desc())
        .limit(5)
        .all()
    )
    top_sources = [{"source": item[0] or "Necunoscut", "count": item[1]} for item in top_sources_raw]

    return {
        "sentimentDistribution": sentiment_distribution, 
        "dailyActivity": daily_activity,
        "categoryDistribution": category_distribution,
        "topSources": top_sources
    }