import os
import chromadb
from typing import List, Dict, Any
import hashlib

# Simple hash-based embedding function (no external API needed!)
class SimpleEmbeddingFunction:
    """
    Simple deterministic embedding function using hash
    Works offline, no API calls needed
    """
    def __call__(self, input):
        if isinstance(input, str):
            input = [input]
        
        embeddings = []
        for text in input:
            # Use SHA-384 to create 48-byte hash = 384 bits
            hash_obj = hashlib.sha384(text.encode())
            hash_bytes = hash_obj.digest()
            # Convert bytes to normalized floats (-1 to 1)
            embedding = [(float(b) - 127.5) / 127.5 for b in hash_bytes]
            embeddings.append(embedding)
        
        return embeddings

class VectorStoreService:
    def __init__(self):
        """Initialize ChromaDB with simple hash-based embeddings"""
        try:
            # Persistent storage
            self.client = chromadb.PersistentClient(path="data/chromadb")
            
            # Create/get collection with simple embedding function
            self.collection = self.client.get_or_create_collection(
                name="vptc_knowledge_base",
                embedding_function=SimpleEmbeddingFunction(),
                metadata={"hnsw:space": "cosine"}
            )
            print(f"✓ Vector store initialized. Documents: {self.collection.count()}")
        except Exception as e:
            print(f"Vector store initialization error: {e}")
            self.collection = None

    def add_documents(self, documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """
        Add documents to ChromaDB
        Embeddings generated automatically by embedding function
        """
        try:
            if self.collection:
                self.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
                print(f"✓ Added {len(documents)} documents")
        except Exception as e:
            print(f"Error adding documents: {e}")

    def search(self, query: str, n_results: int = 3) -> List[str]:
        """
        Semantic search for relevant documents
        """
        try:
            if not self.collection:
                return []
                
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )
            
            # Return matched documents
            return results['documents'][0] if results['documents'] else []
        except Exception as e:
            print(f"Search error: {e}")
            return []

# Singleton instance
vector_store = VectorStoreService()
