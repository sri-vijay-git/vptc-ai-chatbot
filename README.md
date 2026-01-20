# 🎓 VPTC AI Chatbot

> An intelligent, AI-powered conversational assistant for Vignesh Polytechnic College students and staff.

[![Deploy Status](https://img.shields.io/badge/deploy-active-success)](https://vptc-ai-chatbot.vercel.app)
[![License](https://img.shields.io/badge/license-Educational-blue)](LICENSE)

## 📋 Overview

The VPTC AI Chatbot is a full-stack web application that serves as an interactive information hub for Vignesh Polytechnic College. Built with modern technologies and powered by AI, it provides instant, accurate answers about courses, admissions, fees, facilities, and campus life.

### ✨ Key Features

- 🤖 **AI-Powered Chat**: Intelligent responses using Groq AI (Llama 3.3 70B)
- 📚 **RAG System**: Retrieval-Augmented Generation with ChromaDB vector database
- 👤 **User Authentication**: Secure signup/login with Supabase Auth
- 🎯 **Guest Mode**: 20 free trial conversations without signup
- 📱 **Responsive Design**: Beautiful UI optimized for mobile and desktop
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 🔒 **Profile Management**: Account settings with deletion option
- ✅ **Email Verification**: Secure account confirmation flow

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18, TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide icons
- **Authentication**: Supabase Client SDK
- **State Management**: React Hooks & Context API

### Backend
- **Framework**: FastAPI (Python)
- **AI Model**: Groq API (Llama 3.3 70B Versatile)
- **Vector Database**: ChromaDB (for RAG)
- **PDF Processing**: PyPDF2
- **Authentication**: Supabase Auth
- **Deployment**: Render

### Database & Auth
- **Service**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Email/Password with verification

## 📁 Project Structure

```
VPTC_AI_chatbot/
├── frontend/                    # Next.js application
│   ├── app/
│   │   ├── (auth)/             # Auth pages (login, signup, verified)
│   │   ├── (dashboard)/        # Protected pages (chat, profile)
│   │   ├── admin/              # Admin dashboard
│   │   └── page.tsx            # Landing page
│   ├── components/             # Reusable React components
│   ├── contexts/               # React Context (Theme)
│   ├── hooks/                  # Custom hooks (useGuestMode)
│   ├── lib/                    # Utilities (API client)
│   └── styles/                 # CSS files
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/      # API routes (auth, chat, users, admin)
│   │   │   └── dependencies.py # Auth dependencies
│   │   ├── core/               # Config & database
│   │   ├── models/             # Pydantic models
│   │   └── services/           # Business logic (RAG, PDF, AI)
│   ├── data/
│   │   ├── chromadb/           # Vector database storage
│   │   └── documents/          # PDF knowledge base
│   └── ingest.py               # PDF ingestion script
│
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Supabase** account ([Sign up](https://supabase.com))
- **Groq API** key ([Get it here](https://console.groq.com))

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sri-vijay-git/vptc-ai-chatbot.git
cd vptc-ai-chatbot
```

### 2️⃣ Backend Setup

#### Create Virtual Environment

```bash
cd backend
python -m venv venv_stable
```

#### Activate Virtual Environment

**Windows:**
```powershell
.\venv_stable\Scripts\activate
```

**Mac/Linux:**
```bash
source venv_stable/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Project Settings
PROJECT_NAME=VPTC AI Chatbot
API_V1_STR=/api/v1

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Groq API
GROQ_API_KEY=your_groq_api_key

# Frontend URL (for email redirects)
FRONTEND_URL=http://localhost:3000

# Security
SECRET_KEY=your-secret-key-min-32-characters-long
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Ingest Knowledge Base

Place your college PDF documents in `backend/data/documents/` and run:

```bash
python ingest.py
```

#### Start Backend Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### 3️⃣ Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🔑 Key Features Explained

### 1. Guest Mode (Trial Access)
- **No signup required** for first-time users
- **20 free conversations** to try the chatbot
- Usage tracked in browser localStorage
- Automatic prompt to signup after limit

### 2. RAG (Retrieval-Augmented Generation)
- PDF documents chunked and stored in ChromaDB
- Semantic search finds relevant context
- AI generates accurate, grounded responses
- Sources cited in responses

### 3. Email Verification Flow
- Signup sends verification email
- Click link → Redirected to `/verified` page
- Must verify before full access
- Error handling for expired links

### 4. Profile Management
- View account information
- **Delete Account** option in Danger Zone
- Mobile-responsive design

### 5. Admin Dashboard
- Protected admin routes
- User management capabilities
- System monitoring

## 📡 API Endpoints

### Authentication
```
POST /api/v1/auth/signup      - Create new account
POST /api/v1/auth/login       - Login with email/password
```

### Chat
```
POST /api/v1/chat/message     - Send chat message (guest or authenticated)
```

### Users
```
DELETE /api/v1/users/me       - Delete own account
```

### Admin
```
GET  /api/v1/admin/stats      - Get system statistics
```

### Tools
```
GET  /api/v1/tools/sources    - Get available knowledge base sources
```

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Backend (Render)

1. Create new Web Service on [Render](https://render.com)
2. Connect GitHub repository
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables (same as `.env`)
5. **Important**: Set `FRONTEND_URL` to your deployed frontend URL
6. Deploy

## 🔧 Configuration

### Adding New PDFs to Knowledge Base

1. Place PDF files in `backend/data/documents/`
2. Run the ingestion script:
   ```bash
   cd backend
   python ingest.py
   ```
3. Commit and push the updated `chromadb/` directory

### Customizing Chat Behavior

Edit `backend/app/services/rag_service.py`:
- **Chunk size**: Adjust PDF splitting
- **Search results**: Change number of context chunks
- **AI parameters**: Modify temperature, max tokens

## 🎨 UI Customization

### Theme Colors

Edit `frontend/tailwind.config.ts`:
```typescript
colors: {
  primary: '#2563eb',    // Blue
  secondary: '#f5f5f5',  // Light gray
  // ... add custom colors
}
```

### Dark Mode

Toggle is available in the header. Theme persists in localStorage.

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.11+ is installed
- Activate virtual environment
- Check all `.env` values are set
- Verify Supabase credentials

### Frontend can't connect
- Check backend is running on port 8000
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check CORS settings in `backend/app/main.py`

### Email verification not working
- Set `FRONTEND_URL` in backend `.env`
- Check Supabase email templates
- Verify email service is enabled in Supabase

### Guest mode not working
- Clear browser localStorage
- Check `useGuestMode` hook in `frontend/hooks/`
- Verify API allows unauthenticated access

## 📊 Project Stats

- **Lines of Code**: ~5,000+
- **Components**: 15+
- **API Endpoints**: 8
- **Knowledge Base**: Customizable (2 PDFs included)
- **Free Trial Limit**: 20 conversations

## 👥 Contributors

**M Srivijay**  
Diploma in Computer Science Engineering (DCT)  
Vignesh Polytechnic College

## 📝 License

This project is developed as a final year project for educational purposes at Vignesh Polytechnic College.

## 🙏 Acknowledgments

- **Groq** for ultra-fast AI inference
- **Supabase** for backend infrastructure
- **Vercel** for frontend hosting
- **Render** for backend deployment
- **Next.js** team for the amazing framework

---

**Live Demo**: [https://vptc-ai-chatbot.vercel.app](https://vptc-ai-chatbot.vercel.app)

**Need Help?** Feel free to open an issue or contact the development team.
