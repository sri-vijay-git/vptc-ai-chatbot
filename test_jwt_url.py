import base64, json, urllib.request

key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreHlneWd2Z3F4cnNrcmJ6ZmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NDE5OTcsImV4cCI6MjA1MTIxNzk5N30.ux8xjXfHYf82tWAz4x5jtZaKbEq9zSsKCjJbBzS-LIk'

# Decode JWT payload
payload_b64 = key.split('.')[1]
# Add padding
payload_b64 += '=' * (4 - len(payload_b64) % 4)
payload = json.loads(base64.b64decode(payload_b64).decode())
ref = payload.get('ref', 'unknown')
print('JWT project ref (full):', ref)
print('Correct Supabase URL should be: https://' + ref + '.supabase.co')

# Test the JWT URL directly
correct_url = 'https://' + ref + '.supabase.co'
headers = {'apikey': key, 'Authorization': 'Bearer ' + key}
try:
    req = urllib.request.Request(correct_url + '/rest/v1/vptc_embeddings?select=id&limit=1', headers=headers)
    with urllib.request.urlopen(req) as r:
        data = json.loads(r.read())
        print('SUCCESS with JWT URL! Rows:', len(data))
        print('Content-Range:', r.headers.get('Content-Range'))
except Exception as e:
    print('JWT URL error:', e)
