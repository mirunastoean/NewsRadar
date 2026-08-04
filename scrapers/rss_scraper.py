import json
import os
import sys
import time
from dotenv import load_dotenv
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import feedparser
from  confluent_kafka import Producer
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.src.models import models


load_dotenv()

KAFKA_CONFIG = {
    'bootstrap.servers': os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
}
TOPIC_NAME = os.getenv('KAFKA_TOPIC_RSS', 'rss-articles')

def delivery_report(err, msg):
    if err is not None:
        print(f"Eroare la trimiterea mesajului: {err}")

def get_active_sources_from_db():
    db: Session = SessionLocal()
    try:
        sources = db.query(models.Source).filter(models.Source.is_active == True).all()
        return {source.name: source.url for source in sources}
    finally:
        db.close()

def fetch_and_produce_news():
    rss_feeds = get_active_sources_from_db()
    
    if not rss_feeds:
        print("Nu s-au găsit surse active în baza de date! Verifică din interfața Angular.")
        return

    producer = Producer(KAFKA_CONFIG)
    
    for source_name, feed_url in rss_feeds.items():
        print(f"\nIncepem extragerea stirilor de pe: {source_name} ({feed_url})...")
        feed = feedparser.parse(feed_url)
        
        for entry in feed.entries[:10]:
            article_data = {
                "title": entry.title,
                "url": entry.link,
                "content": entry.get("summary", "Nu a fost furnizat un rezumat."),
                "source": source_name
            }
            json_data = json.dumps(article_data)
            producer.produce(TOPIC_NAME, value=json_data.encode('utf-8'), callback=delivery_report)
            time.sleep(0.2)
            
    producer.flush()
    print("\nExtragerea s-a finalizat pentru toate sursele din baza de date!")
if __name__ == "__main__":
    INTERVAL_MINUTE = 60
    
    print(f"Scraper-ul automat a pornit. Va rula o dată la {INTERVAL_MINUTE} minut...")
    while True:
        try:
            fetch_and_produce_news()
        except Exception as e:
            print(f"Eroare neașteptată în scraper: {e}")
            
        print(f"Așteptăm {INTERVAL_MINUTE} minute până la următoarea verificare...")
        time.sleep(INTERVAL_MINUTE * 60)