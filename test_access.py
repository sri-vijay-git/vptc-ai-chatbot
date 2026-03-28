import urllib.request, json

base = 'https://xkxygyhvgqxrskrbzfhm.supabase.co'
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreHlneWh2Z3F4cnNrcmJ6ZmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2OTIxMzUsImV4cCI6MjA4MzI2ODEzNX0.YZaKnBlaZDTmWE_vTmvRoe84eU7ioNM7oE9r6jxHwJI'
headers = {'apikey': key, 'Authorization': 'Bearer ' + key, 'Prefer': 'count=exact'}

# Check embeddings count via Content-Range header
try:
    req = urllib.request.Request(base + '/rest/v1/vptc_embeddings?select=id', headers=headers)
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
        cr = r.headers.get('Content-Range', 'none')
        print('vptc_embeddings Content-Range:', cr)
        print('Rows returned in sample:', len(data))
except Exception as e:
    print('Embeddings error:', e)

print('\nvptc_documents:')
try:
    req2 = urllib.request.Request(base + '/rest/v1/vptc_documents?select=id,filename,uploaded_at', headers=headers)
    with urllib.request.urlopen(req2) as r2:
        docs = json.loads(r2.read())
        for d in docs:
            print(' -', d.get('filename'), '@', d.get('uploaded_at'))
except Exception as e:
    print('Documents error:', e)
