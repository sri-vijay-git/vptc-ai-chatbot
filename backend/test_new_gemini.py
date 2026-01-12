# Test with stable Gemini models that have free tier access

import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
print(f"Testing API Key: {api_key[:20]}...")

client = genai.Client(api_key=api_key)

# Try models in order of most likely to work
models_to_try = [
    'gemini-1.5-pro',
    'gemini-1.5-flash-latest', 
    'gemini-pro',
]

print("\nTrying different models...\n")

for model_name in models_to_try:
    try:
        print(f"Testing {model_name}...", end=" ")
        response = client.models.generate_content(
            model=model_name,
            contents='Say "Hello from Gemini!" in one short sentence.'
        )
        print(f"SUCCESS!")
        print(f"\nResponse: {response.text}\n")
        print(f"==> Use this model: {model_name}")
        break
    except Exception as e:
        error_str = str(e)
        if 'QUOTA' in error_str or '429' in error_str:
            print("QUOTA EXCEEDED")
        elif '404' in error_str or 'NOT_FOUND' in error_str:
            print("MODEL NOT AVAILABLE")
        else:
            print(f"FAILED: {error_str[:50]}")
else:
    print("\n\nAll models failed! Gemini API quota/access issues.")
    print("\nRECOMMENDATION: Use your current fallback system.")
    print("It's working perfectly and ready for your viva!")
