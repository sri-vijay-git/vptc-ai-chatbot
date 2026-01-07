# 🚀 Local Setup Guide - VPTC AI Chatbot

## Prerequisites
- ✅ Python 3.11 installed
- ✅ Node.js 18+ installed
- ✅ Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))
- ✅ Supabase Account ([Sign up here](https://supabase.com))

---

## 🔧 Step 1: Backend Setup

### 1.1 Navigate to backend folder
```powershell
cd "d:\Final Project\VPTC_AI_chatbot\backend"
```

### 1.2 Delete old virtual environment (if exists)
```powershell
Remove-Item -Recurse -Force venv
```

### 1.3 Create fresh virtual environment with Python 3.11
```powershell
py -3.11 -m venv venv
```

### 1.4 Activate virtual environment
```powershell
.\venv\Scripts\activate
```

### 1.5 Upgrade pip
```powershell
python -m pip install --upgrade pip
```

### 1.6 Install dependencies (this will take a few minutes)
```powershell
pip install -r requirements.txt
```

### 1.7 Configure your API keys
Open `backend/.env` and fill in:
```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

### 1.8 Add your college PDFs
Place your PDF files in: `backend/data/documents/`

### 1.9 Run ingestion script
```powershell
python ingest.py
```

### 1.10 Start the backend server
```powershell
uvicorn app.main:app --reload
```

✅ Backend should now be running at `http://localhost:8000`

---

## 🎨 Step 2: Frontend Setup

### 2.1 Open a NEW terminal window

### 2.2 Navigate to frontend folder
```powershell
cd "d:\Final Project\VPTC_AI_chatbot\frontend"
```

### 2.3 Install dependencies
```powershell
npm install
```

### 2.4 Start the development server
```powershell
npm run dev
```

✅ Frontend should now be running at `http://localhost:3000`

---

## 🎯 Step 3: Test the Application

1. Open your browser and go to: `http://localhost:3000`
2. Register a new account
3. Login and start chatting!

---

## 🐛 Troubleshooting

### If backend fails to start:
1. Make sure you're using Python 3.11 (not 3.14)
2. Delete `venv` folder and recreate it
3. Make sure all API keys in `.env` are correct

### If ingestion fails with quota errors:
- Wait a few minutes and try again (free tier has rate limits)
- The script has automatic retry logic

### If frontend can't connect to backend:
- Check that backend is running on port 8000
- Verify `frontend/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

---

## 📝 Quick Start Commands

**Backend (Terminal 1):**
```powershell
cd "d:\Final Project\VPTC_AI_chatbot\backend"
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

**Frontend (Terminal 2):**
```powershell
cd "d:\Final Project\VPTC_AI_chatbot\frontend"
npm run dev
```
