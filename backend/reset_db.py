from database import engine, Base
from src.models.models import Article

print("Ștergem tabela veche...")
Article.__table__.drop(engine, checkfirst=True)

print("Creăm tabela nouă cu toate coloanele...")
Base.metadata.create_all(bind=engine)

print("Baza de date a fost actualizată cu succes!")