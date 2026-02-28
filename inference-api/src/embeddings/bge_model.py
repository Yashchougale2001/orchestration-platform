from typing import List
from sentence_transformers import SentenceTransformer
from src.utils.config_loader import load_model_config


class BGEModel:
    _instance = None

    def __init__(self):
        cfg = load_model_config()
        model_name = cfg.get("embeddings", {}).get(
            "model_name", "BAAI/bge-small-en-v1.5"
        )
        device = cfg.get("embeddings", {}).get("device", "cpu")
        self.model = SentenceTransformer(model_name, device=device)

    @classmethod
    def instance(cls) -> "BGEModel":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def encode(self, texts: List[str]):
        return self.model.encode(texts, show_progress_bar=False, convert_to_numpy=True)