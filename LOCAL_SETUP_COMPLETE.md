# 🎯 Complete Local Setup Guide

## Current Status ✅

✅ Python 3.11 virtual environment created  
✅ All dependencies installed successfully  
✅ ChromaDB configured and working  
✅ PDF file detected in `data/documents/`  
✅ Backend code is ready  

## ⚠️ What You Need To Do

### 1. Get Your API Keys

#### Google Gemini API Key (Required)
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

#### Supabase Credentials (Required for Auth)
1. Go to: https://supabase.com
2. Create a free account
3. Create a new project
4. Go to Project Settings → API
5. Copy:
   - Project URL
   - `anon` public key
   - JWT Secret (in Project Settings → API → JWT Settings)

### 2. Update Your `.env` File

Open `backend/.env` and replace with your actual values:

```env
# Project Settings
PROJECT_NAME=VPTC AI Chatbot
API_V1_STR=/api/v1

# Supabase Configuration
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_KEY=your_actual_anon_key_here
SUPABASE_JWT_SECRET=your_actual_jwt_secret_here

# Google Gemini API
GOOGLE_API_KEY=your_actual_gemini_api_key_here

# Security
SECRET_KEY=your-secret-key-min-32-characters-long-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Run the Ingestion (After API quota resets)

**Note:** You've hit the daily quota limit. Wait until tomorrow or ~30 minutes, then run:

```powershell
cd "d:\Final Project\VPTC_AI_chatbot\backend"
.\venv\Scripts\activate
python ingest.py
```

You should see:
```
🚀 Starting PDF Ingestion Process...
📄 Found 1 PDF files.
   scanning: Vignesh Polytechnic College Overview Request.pdf...
     > Created XX chunks.
💾 Stores XX total chunks into ChromaDB...
✅ Ingestion Complete! The chatbot is now trained on your documents.
```

### 4. Start the Backend Server

```powershell
cd "d:\Final Project\VPTC_AI_chatbot\backend"
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### 5. Start the Frontend

Open a **NEW** terminal window:

```powershell
cd "d:\Final Project\VPTC_AI_chatbot\frontend"
npm install
npm run dev
```

You should see:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

### 6. Open in Browser

Go to: http://localhost:3000

---

## 🐛 Troubleshooting

### "Invalid URL" Error
- Make sure you updated the `.env` file with real Supabase credentials
- The URL should look like: `https://abcdefgh.supabase.co`

### "Quota Exceeded" Error
- You've hit the free tier daily limit
- Wait 24 hours or use a different Google account
- The ingestion from yesterday should still be in the database

### Backend Won't Start
- Make sure virtual environment is activated: `.\venv\Scripts\activate`
- Check that all values in `.env` are filled in (no placeholders)

### Frontend Can't Connect
- Make sure backend is running on port 8000
- Check `frontend/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

---

## 📝 Quick Commands Reference

**Backend:**
```powershell
cd "d:\Final Project\VPTC_AI_chatbot\backend"
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

**Frontend:**
```powershell
cd "d:\Final Project\VPTC_AI_chatbot\frontend"
npm run dev
```

**Test Setup:**
```powershell
cd "d:\Final Project\VPTC_AI_chatbot\backend"
.\venv\Scripts\activate
python test_setup.py
```

---

## ✨ What I Fixed

1. ✅ Created fresh Python 3.11 virtual environment
2. ✅ Fixed all dependency conflicts (numpy, pydantic, httpx, etc.)
3. ✅ Fixed ChromaDB ONNX runtime DLL issue with monkey-patch
4. ✅ Fixed embedding function signature compatibility
5. ✅ Fixed Unicode encoding for Windows console
6. ✅ Created clean `requirements.txt` with pinned versions
7. ✅ Created diagnostic `test_setup.py` script

---

## 🎓 Next Steps

1. Get your Supabase and Gemini API keys
2. Update the `.env` file
3. Wait for API quota to reset (or try tomorrow)
4. Run `python ingest.py`
5. Start backend and frontend
6. Test the chatbot!

**The project is ready to run once you add your API keys!** 🚀
