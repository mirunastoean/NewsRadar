import json
import os
import threading
from confluent_kafka import Consumer, KafkaError
from dotenv import load_dotenv

from database import SessionLocal
from src.models.models import Article

load_dotenv()

KAFKA_BOOTSTRAP_SERVERS = os.getenv('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
KAFKA_TOPIC_RSS = os.getenv('KAFKA_TOPIC_RSS', 'rss-articles')

consumer_config = {
    'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS,
    'group.id': 'backend-articles-group',
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': False  
}

def process_message(msg_value):
    db = SessionLocal()
    try:
        data = json.loads(msg_value)
        
        existing_article = db.query(Article).filter(Article.url == data.get('url')).first()
        
        if not existing_article:
            new_article = Article(
                title=data.get('title'),
                url=data.get('url'),
                content=data.get('content'),
                source=data.get('source')
            )
            db.add(new_article)
            db.commit()
            print(f"Articol salvat in DB: {new_article.title}")
        else:
            print(f"Articol deja existent (ignorat): {existing_article.title}")
        return True 
            
    except Exception as e:
        db.rollback() 
        print(f"Eroare la procesarea in DB: {e}")
        return False 
    finally:
        db.close()

def consume_loop():
    consumer = Consumer(consumer_config)
    consumer.subscribe([KAFKA_TOPIC_RSS])
    
    print(f"Consumer-ul a inceput sa asculte topicul '{KAFKA_TOPIC_RSS}'...")
    
    try:
        while True:
            msg = consumer.poll(1.0)
            
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    continue
                else:
                    print(f"Eroare Kafka: {msg.error()}")
                    break
            
            print("\nMesaj nou interceptat din Kafka!")
            is_success = process_message(msg.value().decode('utf-8'))
            if is_success:
                consumer.commit(message=msg, asynchronous=False)
            else:
                print("Eroare DB: Mesajul a fost reținut în Kafka și nu a primit commit.")
            
    except Exception as e:
        print(f"Consumer-ul s-a oprit: {e}")
    finally:
        consumer.close()

def start_consumer_thread():
    thread = threading.Thread(target=consume_loop, daemon=True)
    thread.start()