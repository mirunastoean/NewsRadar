import json
import os

from dotenv import load_dotenv
from confluent_kafka import Consumer, Producer
from groq import Groq  

load_dotenv()
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
KAFKA_BROKER = 'localhost:9092'
consumer = Consumer({
    'bootstrap.servers': KAFKA_BROKER,
    'group.id': 'ai-enrichment-group',
    'auto.offset.reset': 'earliest'
})
consumer.subscribe(['rss-articles'])
producer = Producer({'bootstrap.servers': KAFKA_BROKER})

print("AI Agent a pornit și ascultă topicul 'rss-articles'...")

def enrich_with_groq(title, content):
    """Funcția care trimite textul la Groq și cere un JSON structurat."""
    prompt = f"""
    Analizează următorul articol de știri și returnează DOAR un obiect JSON valid care conține:
    - "summary": un rezumat scurt în limba română (maxim 2-3 propoziții).
    - "sentiment": sentimentul general ("Pozitiv", "Negativ" sau "Neutru").
    - "category": o categorie relevantă (ex: Tehnologie, Economic, Politic, Social, Sport).
    - "entities": o listă cu entități principale menționate (companii, persoane, locații) sub formă de array de string-uri.

    Titlu: {title}
    Conținut: {content}
    """
    
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices[0].message.content)

try:
    while True:
        msg = consumer.poll(1.0)
        
        if msg is None:
            continue
        if msg.error():
            print(f"Eroare Kafka Consumer: {msg.error()}")
            continue
        raw_article = json.loads(msg.value().decode('utf-8'))
        title = raw_article.get('title', '')
        content = raw_article.get('content', '') or raw_article.get('summary_original', '')
        
        print(f"\nProcesez articolul: {title}")

        try:
            ai_data = enrich_with_groq(title, content)
            raw_article['summary'] = ai_data.get('summary')
            raw_article['sentiment'] = ai_data.get('sentiment')
            raw_article['category'] = ai_data.get('category')
            raw_article['entities'] = ai_data.get('entities', [])
            producer.produce(
                'ai-articles',
                value=json.dumps(raw_article).encode('utf-8')
            )
            producer.flush()
            consumer.commit(msg)
            print(f"Articol îmbogățit și trimis spre 'ai-articles'!")

        except Exception as e:
            print(f"Eroare în timpul procesării AI pentru articolul '{title}': {e}")

except KeyboardInterrupt:
    print("\nOprire AI Agent...")
finally:
    consumer.close()