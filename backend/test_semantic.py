import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.vector_store import vector_store

print("="*60)
print("SEMANTIC RAG VERIFICATION TEST")
print("="*60)

count = vector_store.collection.count() if vector_store.collection else 0
print(f"Total chunks in DB: {count}")

if count == 0:
    print("ERROR: No chunks found! Run ingest.py first.")
    sys.exit(1)

test_queries = [
    ("principal name", "Sarvesan"),
    ("who is the principal", "Sarvesan"),
    ("what courses are offered", "Engineering"),
    ("hostel facility", "hostel"),
    ("placement record", "100%"),
]

passed = 0
failed = 0

for query, expected_keyword in test_queries:
    results = vector_store.search(query, n_results=2)
    combined = " ".join(results).lower()
    ok = expected_keyword.lower() in combined
    status = "PASS" if ok else "FAIL"
    if ok:
        passed += 1
    else:
        failed += 1
    print(f"\n[{status}] Query: '{query}'")
    if results:
        print(f"       Top result: {results[0][:150]}...")
    else:
        print("       No results returned!")

print(f"\n{'='*60}")
print(f"Results: {passed} passed / {failed} failed out of {len(test_queries)} tests")
print("="*60)
