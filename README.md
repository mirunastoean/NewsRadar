# NewsRadar - AI-Powered News Aggregator

NewsRadar este un sistem complet, end-to-end, care extrage știri de pe internet, le procesează folosind inteligența artificială (LLM) pentru a genera rezumate, analiza sentimentul și extrage entitățile, și le afișează într-o interfață web modernă.

## Prezentare Generală a Arhitecturii

Fluxul datelor (Pipeline-ul) funcționează astfel:
1. **RSS Scraper-ul** extrage articole brute și le publică în Apache Kafka (`rss-articles`).
2. **AI Agent-ul** consumă știrile brute, apelează modelul Llama 3.1 (via Groq API) pentru îmbogățirea datelor (rezumat, sentiment, categorii, entități) și le trimite înapoi în Kafka (`ai-articles`).
3. **Backend-ul (FastAPI)** interceptează mesajele finale și le salvează structurat în baza de date PostgreSQL.
4. **Frontend-ul (Angular)** consumă datele prin API și le afișează utilizatorului, având inclusiv integrări pentru grafice interactive și securitate prin Keycloak.

## Tech Stack

*   **Frontend:** Angular 19 (cu Server-Side Rendering), Angular Material, Chart.js.
*   **Backend:** Python 3, FastAPI, SQLAlchemy.
*   **AI / NLP:** API Groq (Llama 3.1-8b).
*   **Message Broker:** Apache Kafka & Zookeeper.
*   **Bază de date:** PostgreSQL 15.
*   **Autentificare:** Keycloak 24.
*   **Infrastructură:** Docker & Docker Compose.

---

## Cerințe Preliminare

Pentru a rula acest proiect local, ai nevoie de următoarele instalate pe sistemul tău:
*   [Docker Desktop](https://www.docker.com/) (pentru containerele de baze de date, Kafka și Keycloak).
*   [Node.js](https://nodejs.org/) (versiunea 18+ pentru Angular).
*   [Python](https://www.python.org/) (versiunea 3.10+).
*   Un cont și un API Key activ pe platforma [Groq](https://console.groq.com/).

> **Notă Importantă:** Creează un fișier `.env` în folderul `backend` care să conțină cheia ta: `GROQ_API_KEY=cheia_ta_aici`.

---

## Ghid de Instalare și Rulare

### 🚀 Metoda Rapidă (Recomandat pentru Windows)
Dacă folosești Windows, am creat un script de automatizare care pornește absolut tot sistemul (Docker, baze de date, backend, AI, scrapere și frontend) într-o singură comandă!

Deschide terminalul în folderul principal al proiectului și rulează:
```bash
.\start_newsradar.bat
```

### 2. Configurarea Backend-ului (FastAPI)
# Crearea și activarea mediului virtual
python -m venv venv
.\venv\Scripts\activate   # Pentru Windows
# source venv/bin/activate # Pentru Linux/Mac

# Instalarea dependențelor (FastAPI, baze de date, Kafka, Groq)
pip install fastapi uvicorn sqlalchemy psycopg2-binary confluent-kafka groq pydantic

# Resetarea / Inițializarea bazei de date (crearea tabelelor)
python reset_db.py

# Pornirea serverului
uvicorn main:app --reload

### 3. Rularea Pipeline-ului de Date (Scraping & AI)
Deschide două terminale noi, asigură-te că mediul virtual (venv) este activat în ambele și rulează:

Terminalul 1 (Pornirea Agentului AI):python scrapers\ai_agent.py
Terminalul 2 (Pornirea Scraperului de date brute): python scrapers\rss_scraper.py


### 4. Pornirea Frontend-ului (Angular)
Deschide un terminal în folderul frontend:
# Instalarea modulelor Node
npm install

# Pornirea serverului de dezvoltare Angular
npm start

