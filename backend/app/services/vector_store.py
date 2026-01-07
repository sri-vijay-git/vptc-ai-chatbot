import os
# Import the patch BEFORE chromadb to fix ONNX runtime issues
from app.core import chromadb_patch

import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
from app.core.config import settings
from typing import List, Dict, Any

# Configure Gemini
genai.configure(api_key=settings.GOOGLE_API_KEY)

class DummyEmbeddingFunction:
    """Dummy embedding function to bypass ChromaDB's default ONNX initialization"""
    def __call__(self, input):
        # ChromaDB expects 'input' parameter, not 'texts'
        # This won't be used since we provide embeddings manually
        if isinstance(input, str):
            input = [input]
        return [[0.0] * 768 for _ in input]

class VectorStoreService:
    def __init__(self):
        # Persistent Client: Stores data in 'backend/data/chromadb'
        self.client = chromadb.PersistentClient(path="data/chromadb")
        
        # Create or get the collection with a dummy embedding function
        # We provide embeddings manually using Google Gemini
        self.collection = self.client.get_or_create_collection(
            name="vptc_knowledge_base",
            embedding_function=DummyEmbeddingFunction(),
            metadata={"hnsw:space": "cosine"}
        )

    def get_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text using Google Gemini Embedding model.
        Model: models/embedding-001
        """
        try:
            result = genai.embed_content(
                model="models/embedding-001",
                content=text,
                task_type="retrieval_document",
                title="College Info"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return []

    def add_documents(self, documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """
        Add documents to ChromaDB. 
        We generate embeddings manually to ensure we use the Google model.
        """
        # Generate embeddings in batch if possible, or loop (Gemini has limits, go slow or batch)
        # For this diploma project, loop is fine for ingestion script.
        embeddings = []
        for doc in documents:
            emb = self.get_embedding(doc)
            embeddings.append(emb)

        self.collection.add(
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas,
            ids=ids
        )

    def search(self, query: str, n_results: int = 3) -> List[str]:
        """
        Semantic search for relevant documents.
        """
        query_embedding = genai.embed_content(
            model="models/embedding-001",
            content=query,
            task_type="retrieval_query"
        )['embedding']
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # valid matches
        return results['documents'][0] if results['documents'] else []

vector_store = VectorStoreService()
