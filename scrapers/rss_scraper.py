import requests
import feedparser
import time

API_URL = "http://127.0.0.1:8000/articles/"
RSS_FEED_URL = "https://www.hotnews.ro/rss"
SOURCE_NAME = "HotNews"

def fetch_and_save_news():
    print(f"Incepem extragerea stirilor de pe: {SOURCE_NAME}...")
    feed = feedparser.parse(RSS_FEED_URL)
    for entry in feed.entries[:10]:
        article_data={
            "title": entry.title,
            "url": entry.link,
            "content": entry.get("summary", "Nu a fost furnizat un rezumat."),
            "source": SOURCE_NAME
        }
    try:
        response = requests.post(API_URL, json=article_data)
        if response.status_code == 200:
            print(f"Salvat cu succes: {entry.title}")
        elif response.status_code == 400:
            print(f"Sarit(exista deja): {entry.title}")
        else:
            print(f"Eroare la {entry.title}- Status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print(f"Eroare: Backend-ul nu raspunde. Asigura-te ca uvicorn este pornit!")
    time.sleep(0.5)
print("Extragerea s-a finalizat!")

if __name__ == "__main__":
    fetch_and_save_news()