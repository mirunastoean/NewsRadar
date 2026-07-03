import json
import time
import feedparser
from confluent_kafka import Producer


KAFKA_CONFIG = {
    'bootstrap.servers': 'localhost:9092'
}
TOPIC_NAME = 'rss-articles'
# API_URL = "http://127.0.0.1:8000/articles/"
RSS_FEED_URL = "https://www.hotnews.ro/rss"
SOURCE_NAME = "HotNews"

def delivery_report(err, msg):
    if err is not None:
        print(f"Eroare la trimiterea mesajului: {err}")
    else:
        print(f"Mesaj trimis cu succes in Kafka pe topicul {msg.topic()}")

def fetch_and_produce_news():
    print(f"Incepem extragerea stirilor de pe: {SOURCE_NAME}...")
    producer = Producer(KAFKA_CONFIG)
    feed = feedparser.parse(RSS_FEED_URL)
    for entry in feed.entries[:10]:
        article_data={
            "title": entry.title,
            "url": entry.link,
            "content": entry.get("summary", "Nu a fost furnizat un rezumat."),
            "source": SOURCE_NAME
        }
        json_data = json.dumps(article_data)
        producer.produce(TOPIC_NAME, value=json_data.encode('utf-8'), callback=delivery_report)
        time.sleep(0.2)
    producer.flush()
    print("Extragerea s-a finalizat!")

if __name__ == "__main__":
    fetch_and_produce_news()