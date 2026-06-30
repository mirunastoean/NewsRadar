class ArticleAlreadyExistsError(Exception):
    def __init__(self, detail: str = "Acest articol există deja în baza de date."):
        self.detail = detail