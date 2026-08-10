@echo off
echo ===================================================
echo       Pornire NewsRadar - AI News Aggregator
echo ===================================================

echo [1/5] Pornesc infrastructura (Docker)...
docker-compose up -d
echo Astept 10 secunde pentru initializarea bazelor de date si Kafka...
timeout /t 10 /nobreak

echo [2/5] Pornesc Backend-ul (FastAPI)...
start "Backend - FastAPI" cmd /k "cd backend && .\venv\Scripts\activate && uvicorn main:app --reload"

echo [3/5] Pornesc RSS Scraper...
start "Scraper - Date Brute" cmd /k "cd backend && .\venv\Scripts\activate && cd ..  && python scrapers\rss_scraper.py"

echo [4/5] Pornesc AI Agent...
start "AI Agent - Llama 3" cmd /k "cd backend && .\venv\Scripts\activate && cd .. && python scrapers\ai_agent.py"

echo [5/5] Pornesc Frontend-ul (Angular)...
start "Frontend - Angular" cmd /k "cd frontend && npm start"

echo ===================================================
echo Toate serviciile au fost pornite in ferestre separate!
echo Aplicatia web va fi disponibila la http://localhost:4200
echo ===================================================
pause