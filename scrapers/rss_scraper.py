import json
import os
import time

from dotenv import load_dotenv
import feedparser
from confluent_kafka import Producer

load_dotenv()
KAFKA_CONFIG = {
    'bootstrap.servers': os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
}
TOPIC_NAME = os.getenv('KAFKA_TOPIC_RSS', 'rss-articles')

RSS_FEEDS = {
    "HotNews": "https://www.hotnews.ro/rss",
    "Digi24": "https://www.digi24.ro/rss",
    "Adevărul": "https://adevarul.ro/rss",
    "Ziare.com": "https://ziare.com/rss",
    "SpotMedia": "https://spotmedia.ro/rss"
}

def delivery_report(err, msg):
    if err is not None:
        print(f"Eroare la trimiterea mesajului: {err}")

def fetch_and_produce_news():
    producer = Producer(KAFKA_CONFIG)
    
    for source_name, feed_url in RSS_FEEDS.items():
        print(f"\nIncepem extragerea stirilor de pe: {source_name}...")
        feed = feedparser.parse(feed_url)
        
        for entry in feed.entries[:10]:
            article_data={
                "title": entry.title,
                "url": entry.link,
                "content": entry.get("summary", "Nu a fost furnizat un rezumat."),
                "source": source_name
            }
            json_data = json.dumps(article_data)
            producer.produce(TOPIC_NAME, value=json_data.encode('utf-8'), callback=delivery_report)
            time.sleep(0.2)
            
    producer.flush()
    print("\nExtragerea s-a finalizat pentru toate sursele!")

if __name__ == "__main__":
    fetch_and_produce_news()