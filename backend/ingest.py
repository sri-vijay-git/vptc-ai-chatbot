import os
import sys
import re

# Configure UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Add the parent directory (backend) to sys.path so we can import 'app' modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.vector_store import vector_store

DOCUMENTS_DIR = "data/documents"


def chunk_markdown_by_sections(text: str, source: str) -> list[dict]:
    """
    Split a markdown file into chunks based on ## headings.
    Each top-level section (##) becomes one chunk.
    FAQ Q&A pairs under ## FAQ are each split into individual chunks.
    Returns a list of dicts: { 'text': str, 'section': str }
    """
    chunks = []

    # Split by ## headings (keep the heading in the chunk)
    sections = re.split(r'(?=^## )', text, flags=re.MULTILINE)

    for section in sections:
        section = section.strip()
        if not section:
            continue

        # Extract section heading
        heading_match = re.match(r'^## (.+)', section)
        section_title = heading_match.group(1).strip() if heading_match else "General"

        # Special handling: split FAQ into individual Q&A chunks
        if "frequently asked questions" in section_title.lower() or section_title.upper() == "FAQ":
            qa_pairs = re.split(r'(?=^### Q:)', section, flags=re.MULTILINE)
            for qa in qa_pairs:
                qa = qa.strip()
                if qa and len(qa) > 20:
                    chunks.append({"text": qa, "section": "FAQ"})
        else:
            # Normal section — store as one chunk
            if len(section) > 30:  # skip trivially small sections
                chunks.append({"text": section, "section": section_title})

    return chunks


def chunk_plain_text(text: str, chunk_size: int = 800, overlap: int = 150) -> list[str]:
    """
    Fallback: fixed-size chunking for plain text / PDF content.
    Uses sentence boundaries when possible.
    """
    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = start + chunk_size

        if end < text_len:
            # Try to break at sentence boundary
            for split_char in ['\n\n', '\n', '. ', ' ']:
                last_occ = text.rfind(split_char, start, end)
                if last_occ != -1 and last_occ > start + int(chunk_size * 0.6):
                    end = last_occ + len(split_char)
                    break

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - overlap
        if start >= end:
            start = end

    return chunks


def ingest_documents():
    print("🚀 Starting Ingestion Process...")
    print("=" * 60)

    # Step 1: Check directory
    if not os.path.exists(DOCUMENTS_DIR):
        print(f"❌ Documents directory not found: {DOCUMENTS_DIR}")
        return

    valid_extensions = ('.pdf', '.txt', '.md')
    files = [f for f in os.listdir(DOCUMENTS_DIR) if f.lower().endswith(valid_extensions)]

    if not files:
        print("⚠️  No compatible files (.pdf, .txt, .md) found.")
        return

    print(f"📄 Found {len(files)} document(s): {', '.join(files)}\n")

    # Step 2: Clear old (broken) embeddings
    print("🗑️  Clearing old embeddings from vector store...")
    vector_store.clear_collection()

    all_texts = []
    all_ids = []
    all_metadatas = []

    # Step 3: Process each file
    for filename in files:
        file_path = os.path.join(DOCUMENTS_DIR, filename)
        print(f"\n📝 Processing: {filename}")

        raw_text = ""

        if filename.lower().endswith('.pdf'):
            try:
                import PyPDF2
                with open(file_path, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            raw_text += page_text + "\n"
            except Exception as e:
                print(f"   ❌ Error reading PDF: {e}")
                continue
        else:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    raw_text = f.read()
            except Exception as e:
                print(f"   ❌ Error reading file: {e}")
                continue

        if not raw_text.strip():
            print(f"   ⚠️  Skipping empty file.")
            continue

        # Step 4: Chunk the content
        if filename.lower().endswith('.md'):
            # Smart section-based chunking for markdown
            section_chunks = chunk_markdown_by_sections(raw_text, filename)
            print(f"   ✅ Created {len(section_chunks)} section-based chunks")

            for i, chunk_data in enumerate(section_chunks):
                chunk_id = f"{filename}_section_{i}"
                all_texts.append(chunk_data["text"])
                all_ids.append(chunk_id)
                all_metadatas.append({
                    "source": filename,
                    "section": chunk_data["section"],
                    "chunk_index": i,
                    "type": "section"
                })
        else:
            # Fallback fixed-size chunking for PDFs/plain text
            text_chunks = chunk_plain_text(raw_text)
            print(f"   ✅ Created {len(text_chunks)} text chunks")

            for i, chunk in enumerate(text_chunks):
                chunk_id = f"{filename}_chunk_{i}"
                all_texts.append(chunk)
                all_ids.append(chunk_id)
                all_metadatas.append({
                    "source": filename,
                    "section": "General",
                    "chunk_index": i,
                    "type": "text"
                })

    if not all_texts:
        print("\n❌ No valid text extracted from any document.")
        return

    # Step 5: Store everything in ChromaDB with semantic embeddings
    print(f"\n💾 Storing {len(all_texts)} total chunks with SEMANTIC embeddings...")
    print("   (This may take a moment on first run as the model generates embeddings)")

    try:
        vector_store.add_documents(all_texts, all_metadatas, all_ids)
        print("\n" + "=" * 60)
        print("✅ Ingestion Complete!")
        print(f"   📊 Total chunks stored: {len(all_texts)}")
        print(f"   🧠 Embedding type: Semantic (sentence-transformers)")
        print(f"   🔍 The chatbot can now answer questions accurately!")
        print("=" * 60)
    except Exception as e:
        print(f"❌ Error saving to vector store: {e}")


if __name__ == "__main__":
    ingest_documents()
