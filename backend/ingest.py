import os
import sys

# Configure UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Add the parent directory (backend) to sys.path so we can import 'app' modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pdf_service import pdf_service
from app.services.vector_store import vector_store

DOCUMENTS_DIR = "data/documents"

def ingest_documents():
    print("🚀 Starting PDF Ingestion Process...")
    
    # Check if directory exists
    if not os.path.exists(DOCUMENTS_DIR):
        print(f"❌ Documents directory not found at {DOCUMENTS_DIR}")
        print("Please create it and add your PDF files.")
        return

    valid_extensions = ('.pdf', '.txt', '.md')
    files = [f for f in os.listdir(DOCUMENTS_DIR) if f.lower().endswith(valid_extensions)]
    
    if not files:
        print("⚠️  No compatible files (.pdf, .txt, .md) found in data/documents/")
        return

    print(f"📄 Found {len(files)} documents.")

    documents_content = []
    ids = []
    metadatas = []

    for filename in files:
        file_path = os.path.join(DOCUMENTS_DIR, filename)
        print(f"   scanning: {filename}...")
        
        raw_text = ""
        if filename.lower().endswith('.pdf'):
            # 1. Extract Text from PDF
            raw_text = pdf_service.extract_text_from_pdf(file_path)
        else:
            # 1. Extract Text from Text/Markdown
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    raw_text = f.read()
            except Exception as e:
                print(f"   ❌ Error reading file {filename}: {e}")
                continue
        
        if not raw_text:
            print(f"   ⚠️  Skipping empty file: {filename}")
            continue

        # 2. Chunk Text
        chunks = pdf_service.chunk_text(raw_text)
        print(f"     > Created {len(chunks)} chunks.")

        # 3. Prepare for Vector Store
        for i, chunk in enumerate(chunks):
            documents_content.append(chunk)
            ids.append(f"{filename}_{i}")
            metadatas.append({"source": filename, "chunk_index": i})

    if not documents_content:
        print("❌ No valid text extracted from documents.")
        return

    print(f"💾 Stores {len(documents_content)} total chunks into ChromaDB...")
    
    # 4. Store in ChromaDB (Embeddings generated automatically inside add_documents)
    try:
        vector_store.add_documents(documents_content, metadatas, ids)
        print("✅ Ingestion Complete! The chatbot is now trained on your documents.")
    except Exception as e:
        print(f"❌ Error saving to database: {e}")

if __name__ == "__main__":
    ingest_documents()
