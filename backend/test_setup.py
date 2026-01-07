"""
Simple test script to verify the backend setup
"""
import os
import sys

# Configure UTF-8 encoding for Windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

# Add the parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

print("=" * 50)
print("VPTC AI Chatbot - Setup Verification")
print("=" * 50)

# Test 1: Check environment variables
print("\n[1] Checking environment variables...")
try:
    from app.core.config import settings
    print(f"   ✓ GOOGLE_API_KEY: {'Set' if settings.GOOGLE_API_KEY and settings.GOOGLE_API_KEY != 'your_gemini_api_key' else 'NOT SET'}")
    print(f"   ✓ SUPABASE_URL: {'Set' if settings.SUPABASE_URL and settings.SUPABASE_URL != 'your_supabase_url' else 'NOT SET'}")
    print(f"   ✓ SUPABASE_KEY: {'Set' if settings.SUPABASE_KEY and settings.SUPABASE_KEY != 'your_supabase_anon_key' else 'NOT SET'}")
except Exception as e:
    print(f"   ✗ Error loading config: {e}")

# Test 2: Check PDF directory
print("\n[2] Checking PDF documents directory...")
docs_dir = "data/documents"
if os.path.exists(docs_dir):
    pdf_files = [f for f in os.listdir(docs_dir) if f.lower().endswith('.pdf')]
    print(f"   ✓ Directory exists: {os.path.abspath(docs_dir)}")
    print(f"   ✓ PDF files found: {len(pdf_files)}")
    for pdf in pdf_files:
        print(f"      - {pdf}")
else:
    print(f"   ✗ Directory NOT found: {os.path.abspath(docs_dir)}")
    print("   Creating directory...")
    os.makedirs(docs_dir, exist_ok=True)
    print(f"   ✓ Created: {os.path.abspath(docs_dir)}")
    print("   Please add your PDF files to this directory")

# Test 3: Test ChromaDB
print("\n[3] Testing ChromaDB...")
try:
    from app.services.vector_store import vector_store
    print("   ✓ ChromaDB initialized successfully")
except Exception as e:
    print(f"   ✗ ChromaDB error: {e}")

# Test 4: Test Google Gemini
print("\n[4] Testing Google Gemini API...")
try:
    import google.generativeai as genai
    from app.core.config import settings
    genai.configure(api_key=settings.GOOGLE_API_KEY)
    
    # Try a simple embedding
    result = genai.embed_content(
        model="models/embedding-001",
        content="test",
        task_type="retrieval_document"
    )
    print("   ✓ Gemini API working")
    print(f"   ✓ Embedding dimension: {len(result['embedding'])}")
except Exception as e:
    print(f"   ✗ Gemini API error: {e}")

print("\n" + "=" * 50)
print("Setup verification complete!")
print("=" * 50)
