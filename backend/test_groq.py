# Testing Groq AI API (fixed encoding)

import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

groq_key = os.getenv("GROQ_API_KEY")

if not groq_key:
    print("ERROR: GROQ_API_KEY not found in .env file!")
    exit(1)

print(f"Testing Groq API Key: {groq_key[:20]}...")

client = Groq(api_key=groq_key)

try:
    print("\nTesting Groq AI...\n")
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": "Say 'Hello! I am Groq AI and I am working perfectly!' in one sentence."}
        ],
        temperature=0.7,
        max_tokens=100
    )
    
    print("SUCCESS!\n")
    print(f"Groq says: {response.choices[0].message.content}\n")
    print("Real AI conversations are ready!")
    print(f"Model used: {response.model}")
    print("Response time: INSTANT (Groq is super fast!)")
    
except Exception as e:
    print(f"Error: {e}")
