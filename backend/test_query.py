import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.services.vector_store import vector_store

query = "principle phone number"
res = vector_store.search(query, n_results=5)
print("FOUND CHUNKS:", len(res))
for i, c in enumerate(res):
    print(f"--- Chunk {i} ---")
    print(c[:200])
