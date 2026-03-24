import sys
import os
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['TOKENIZERS_PARALLELISM'] = 'false'

try:
    from app.services.vector_store import vector_store
    print(f"✓ Vector store loaded. Count: {vector_store.collection.count() if vector_store.collection else 0}")

    print("\n🗑️ Clearing collection...")
    vector_store.clear_collection()
    print(f"✓ Cleared. Count: {vector_store.collection.count()}")

    print("\n📝 Adding test document...")
    vector_store.add_documents(
        ["Principal: Sarvesan D., M.Tech ECE"],
        [{"source": "test", "section": "Admin"}],
        ["test_doc_0"]
    )
    print(f"✓ Added. Count: {vector_store.collection.count()}")

    print("\n🔍 Searching...")
    results = vector_store.search("who is the principal", n_results=1)
    print(f"✓ Result: {results}")

except Exception as e:
    print(f"\n❌ ERROR: {e}")
    traceback.print_exc()
