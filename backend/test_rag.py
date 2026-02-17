import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.vector_store import vector_store

# Test queries
test_queries = [
    "principal name",
    "who is the principal",
    "principal of VPTC",
    "head of college"
]

print("🔍 Testing ChromaDB RAG System\n")
print(f"Total documents in database: {vector_store.collection.count() if vector_store.collection else 0}\n")
print("="*60)

for query in test_queries:
    print(f"\n📝 Query: '{query}'")
    print("-" * 60)
    
    results = vector_store.search(query, n_results=2)
    
    if results:
        for i, result in enumerate(results, 1):
            print(f"\n[Result {i}]")
            print(result[:300] + "..." if len(result) > 300 else result)
    else:
        print("❌ No results found")
    
    print("-" * 60)

print("\n✅ Test complete!")
