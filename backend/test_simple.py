import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.vector_store import vector_store

# Simple test
print(f"Database has {vector_store.collection.count()} documents")

# Search for principal
results = vector_store.search("principal name", n_results=3)

print("\nSearch Results for 'principal name':")
print("="*60)

if results:
    for i, result in enumerate(results, 1):
        print(f"\n[Chunk {i}]")
        print(result)
        print("-"*60)
else:
    print("No results found")
