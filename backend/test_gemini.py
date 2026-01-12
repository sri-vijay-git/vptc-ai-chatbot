# Testing Google Gemini API Connection

import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure API
api_key = os.getenv("GOOGLE_API_KEY")
print(f"API Key (first 10 chars): {api_key[:10] if api_key else 'NOT FOUND'}")

genai.configure(api_key=api_key)

# Test different model names
models_to_test = [
    "gemini-pro",
    "gemini-1.0-pro",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "models/gemini-pro",
    "models/gemini-1.5-flash"
]

print("\n🧪 Testing Gemini Models:\n")

for model_name in models_to_test:
    try:
        print(f"Testing: {model_name}...", end=" ")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Say 'Hello, I am working!' in one sentence.")
        print(f"✅ SUCCESS! Response: {response.text[:50]}")
        break  # Stop at first working model
    except Exception as e:
        error_msg = str(e)[:100]
        print(f"❌ FAILED: {error_msg}")

# List available models
try:
    print("\n📋 Available Models:")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
except Exception as e:
    print(f"❌ Could not list models: {e}")
