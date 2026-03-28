import os, sys

os.environ['SUPABASE_URL'] = 'https://xkxygygvgqxrskrbzfhm.supabase.co'
os.environ['SUPABASE_KEY'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreHlneWd2Z3F4cnNrcmJ6ZmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDE5OTcsImV4cCI6MjA1MTIxNzk5N30.ux8xjXfHYf82tWAz4x5jtZaKbEq9zSsKCjJbBzS-LIk'

from supabase import create_client

sb = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_KEY'])

# Count embeddings
res = sb.table('vptc_embeddings').select('id', count='exact').execute()
print(f'Total embeddings in Supabase: {res.count}')

# Count documents
doc_res = sb.table('vptc_documents').select('*').execute()
print(f'Total documents: {len(doc_res.data)}')
for d in doc_res.data:
    print(f'  - {d["filename"]} (uploaded: {d["uploaded_at"]})')

# Test vector similarity search
try:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    q = 'Who is the principal?'
    vec = model.encode([q], normalize_embeddings=True)[0].tolist()
    search_res = sb.rpc('match_vptc_embeddings', {
        'query_embedding': vec,
        'match_threshold': 0.3,
        'match_count': 3
    }).execute()
    print(f'\nSearch for "{q}" returned {len(search_res.data)} results:')
    for r in search_res.data:
        print(f'  Score: {r["similarity"]:.3f} | {r["content"][:80]}...')
except Exception as e:
    print(f'Search error: {e}')
