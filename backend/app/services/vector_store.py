import os
from typing import List, Dict, Any

# Path to persistent ChromaDB storage (committed to git → works on Render too)
CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "chromadb")
CHROMA_COLLECTION = "vptc_knowledge"


class SemanticEmbeddingFunction:
    """
    Real semantic embedding using sentence-transformers.
    Model: all-MiniLM-L6-v2 — fast, lightweight, highly accurate.
    Downloads once (~90MB), works fully offline after that.
    """
    def __init__(self):
        from sentence_transformers import SentenceTransformer
        print("⏳ Loading semantic embedding model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("✅ Semantic embedding model loaded!")

    def embed(self, texts: List[str]) -> List[List[float]]:
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        return embeddings.tolist()


class VectorStoreService:
    def __init__(self):
        """Initialize local ChromaDB — persistent, zero-config, works locally & on Render."""
        try:
            import chromadb
            from chromadb.config import Settings

            abs_path = os.path.abspath(CHROMA_DB_PATH)
            os.makedirs(abs_path, exist_ok=True)

            self.client = chromadb.PersistentClient(path=abs_path)
            self.collection = self.client.get_or_create_collection(
                name=CHROMA_COLLECTION,
                metadata={"hnsw:space": "cosine"}
            )
            self.embedding_fn = SemanticEmbeddingFunction()

            count = self.collection.count()
            print(f"✅ ChromaDB ready — {count} chunks in collection '{CHROMA_COLLECTION}'")
            self.init_error = None

        except Exception as e:
            print(f"❌ ChromaDB initialization error: {e}")
            self.init_error = str(e)
            self.collection = None

    def add_documents(self, documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """
        Embed and insert documents into ChromaDB.
        Automatically skips duplicate IDs (upsert behaviour).
        """
        if not self.collection:
            print("⚠️ ChromaDB not initialized, skipping add_documents")
            return

        try:
            embeddings = self.embedding_fn.embed(documents)

            self.collection.upsert(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadatas,
                ids=ids
            )
            print(f"✅ Upserted {len(documents)} chunks into ChromaDB")
        except Exception as e:
            print(f"❌ Error adding documents to ChromaDB: {e}")

    def clear_collection(self):
        """Delete and recreate the collection (full reset)."""
        try:
            import chromadb
            abs_path = os.path.abspath(CHROMA_DB_PATH)
            self.client.delete_collection(CHROMA_COLLECTION)
            self.collection = self.client.get_or_create_collection(
                name=CHROMA_COLLECTION,
                metadata={"hnsw:space": "cosine"}
            )
            print("🗑️ ChromaDB collection cleared and recreated.")
        except Exception as e:
            print(f"Error clearing collection: {e}")

    def search(self, query: str, n_results: int = 5) -> List[str]:
        """
        Semantic search using ChromaDB cosine similarity.
        Falls back to keyword search if no semantic results found.
        """
        if not self.collection:
            return []

        try:
            count = self.collection.count()
            if count == 0:
                print("⚠️ ChromaDB collection is empty — no results")
                return []

            query_embedding = self.embedding_fn.embed([query])[0]

            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=min(n_results, count),
                include=["documents", "distances"]
            )

            docs = results.get("documents", [[]])[0]
            distances = results.get("distances", [[]])[0]

            # Filter by similarity threshold (cosine distance < 0.85 means similarity > 0.15)
            filtered = [doc for doc, dist in zip(docs, distances) if dist < 0.85]

            if filtered:
                return filtered

            # Keyword fallback
            print("⚠️ Semantic search below threshold, trying keyword fallback...")
            return self._keyword_search(query, n_results)

        except Exception as e:
            import traceback
            print(f"❌ Search error: {traceback.format_exc()}")
            return self._keyword_search(query, n_results)

    def _keyword_search(self, query: str, n_results: int = 5) -> List[str]:
        """Lightweight keyword fallback using ChromaDB's where_document filter."""
        if not self.collection:
            return []

        try:
            stop_words = {"what", "who", "is", "the", "are", "of", "in", "at",
                          "a", "an", "do", "does", "how", "many", "tell", "me", "about"}
            words = [w for w in query.lower().split() if w not in stop_words and len(w) > 2]
            search_term = words[0] if words else query.split()[0]

            results = self.collection.query(
                query_texts=[search_term],
                n_results=min(n_results, self.collection.count()),
                include=["documents"]
            )
            docs = results.get("documents", [[]])[0]
            return docs if docs else []
        except Exception as e:
            print(f"Keyword fallback error: {e}")
            return []

    def get_chunk_count(self) -> int:
        """Returns total number of chunks stored."""
        if not self.collection:
            return 0
        return self.collection.count()


# Singleton instance
vector_store = VectorStoreService()
