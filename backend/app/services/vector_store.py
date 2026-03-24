import os
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
        """Initialize PGVector integration with Supabase"""
        try:
            self.embedding_fn = SemanticEmbeddingFunction()
            
            # We connect to Supabase instead of a local file DB
            # We use the admin client if available to bypass RLS for systemic uploads
            from app.core.database import get_supabase_admin_client, supabase
            self.supabase = get_supabase_admin_client() or supabase
            
            print("✓ Vector store connected to Supabase PGVector.")
            self.init_error = None
        except Exception as e:
            print(f"Vector store initialization error: {e}")
            self.init_error = str(e)
            import traceback
            self.init_traceback = traceback.format_exc()

    def add_documents(self, documents: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        """
        Embed and insert documents into Supabase.
        Expects metadatas to contain 'document_id' matching a row in 'vptc_documents'.
        """
        try:
            embeddings = self.embedding_fn(documents)
            
            # Prepare rows for insertion
            rows = []
            for doc, meta, emb in zip(documents, metadatas, embeddings):
                if isinstance(emb, list):
                    emb_list = emb
                else:
                    emb_list = emb.tolist()
                    
                rows.append({
                    "content": doc,
                    "embedding": emb_list,
                    "document_id": meta.get("document_id")
                })
            
            if rows:
                self.supabase.table("vptc_embeddings").insert(rows).execute()
                print(f"✓ Added {len(rows)} chunks to Supabase PGVector")
                
        except Exception as e:
            print(f"Error adding documents to Supabase: {e}")

    def clear_collection(self):
        """Not commonly used in production PGVector. Just here for safety."""
        pass

    def search(self, query: str, n_results: int = 3) -> List[str]:
        """
        Semantic search using Supabase Postgres Function `match_vptc_embeddings`.
        """
        try:
            query_vector = self.embedding_fn([query])[0]
            
            response = self.supabase.rpc(
                "match_vptc_embeddings",
                {
                    "query_embedding": query_vector,
                    "match_threshold": 0.3,
                    "match_count": n_results
                }
            ).execute()
            
            if response.data:
                # Return just the contents of the matching documents
                return [row["content"] for row in response.data]
            return []
        except Exception as e:
            import traceback
            print(f"Search error: {traceback.format_exc()}")
            return []


# Singleton instance
vector_store = VectorStoreService()
