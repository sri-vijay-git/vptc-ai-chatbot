import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import chromadb

# Initialize client
client = chromadb.PersistentClient(path="data/chromadb")

# Get collection
try:
    collection = client.get_collection(name="vptc_knowledge_base")
    count = collection.count()
    
    print(f"✅ PDF Ingestion Status:")
    print(f"   📊 Total chunks in database: {count}")
    
    if count > 0:
        print(f"   ✓ ChromaDB is populated with data!")
        print(f"   ✓ PDF ingestion is COMPLETE")
        
        # Show a sample
        result = collection.peek(limit=1)
        if result and result['metadatas']:
            source = result['metadatas'][0].get('source', 'Unknown')
            print(f"   📄 Source document: {source}")
    else:
        print(f"   ⚠️  Database is empty - need to run: python ingest.py")
        
except Exception as e:
    print(f"❌ Collection not found or error: {e}")
    print(f"   Need to run: python ingest.py")
