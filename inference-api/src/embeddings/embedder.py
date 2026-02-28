from typing import List
from src.embeddings.bge_model import BGEModel


class EmbeddingService:
    def __init__(self):
        self.model = BGEModel.instance()

    def embed_texts(self, texts: List[str]):
        return self.model.encode(texts)

    def embed_query(self, query: str):
        return self.model.encode([query])[0]