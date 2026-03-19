import os
import chromadb
from typing import List, Dict, Any

class SemanticEmbeddingFunction:
    """
    Real semantic embedding function using sentence-transformers.
    Model: all-MiniLM-L6-v2 — fast, lightweight, highly accurate.
    Downloads once (~90MB), works fully offline after that.
    """
    def __init__(self):
        from sentence_transformers import SentenceTransformer
        print("⏳ Loading semantic embedding model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Semantic embedding model loaded!")

    def __call__(self, input):
        if isinstance(input, str):
            input = [input]
        embeddings = self.model.encode(input, normalize_embeddings=True)
        return embeddings.tolist()


class VectorStoreService:
    def __init__(self):
        """Initialize ChromaDB with semantic embeddings"""
        try:
            self.embedding_fn = SemanticEmbeddingFunction()

            # Persistent storage
            self.client = chromadb.PersistentClient(path="data/chromadb")

            # Create/get collection with semantic embedding function
            self.collection = self.client.get_or_create_collection(
                name="vptc_knowledge_base",
                embedding_function=self.embedding_fn,
                metadata={"hnsw:space": "cosine"}
            )
            print(f"✓ Vector store initialized. Documents: {self.collection.count()}")
        except Exception as e:
            print(f"Vector store initialization error: {e}")
            self.collection = None

    def add_documents(self, documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """
        Add documents to ChromaDB.
        Embeddings generated automatically by SemanticEmbeddingFunction.
        """
        try:
            if self.collection:
                self.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
                print(f"✓ Added {len(documents)} chunks to vector store")
        except Exception as e:
            print(f"Error adding documents: {e}")

    def clear_collection(self):
        """Delete and recreate the collection to clear all old embeddings."""
        try:
            self.client.delete_collection("vptc_knowledge_base")
            self.collection = self.client.get_or_create_collection(
                name="vptc_knowledge_base",
                embedding_function=self.embedding_fn,
                metadata={"hnsw:space": "cosine"}
            )
            print("🗑️  Old collection cleared. Fresh collection ready.")
        except Exception as e:
            print(f"Error clearing collection: {e}")

    def search(self, query: str, n_results: int = 3) -> List[str]:
        """
        Semantic search — finds documents by meaning, not keywords.
        """
        try:
            if not self.collection:
                return []

            count = self.collection.count()
            if count == 0:
                print("⚠️  Vector store is empty. Run ingest.py first!")
                return []

            # Don't request more results than we have
            actual_n = min(n_results, count)

            results = self.collection.query(
                query_texts=[query],
                n_results=actual_n
            )

            return results['documents'][0] if results['documents'] else []
        except Exception as e:
            print(f"Search error: {e}")
            return []


# Singleton instance
vector_store = VectorStoreService()
