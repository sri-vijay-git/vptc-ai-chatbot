# VPTC AI Chatbot

AI-Powered Companion for Vignesh Polytechnic College

## Overview

The VPTC AI Chatbot is a comprehensive, AI-driven web application designed to serve as a central information and assistance hub for students. It features:

- **Grounded Conversational Q&A**: RAG-powered chatbot using Google Gemini API
- **Personalized User Accounts**: Secure authentication with Supabase
- **Academic Advisor Module**: Course recommendations, prerequisite checking, and GPA simulation
- **Document Assistant**: Upload and query PDF documents
- **Modern Tech Stack**: Next.js, FastAPI, Supabase, ChromaDB, Google Gemini

## Technology Stack

- **Frontend**: Next.js 14+ (React) + Tailwind CSS
- **Backend**: Python FastAPI
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **AI Model**: Google Gemini API
- **Vector DB**: ChromaDB (self-hosted)
- **Deployment**: Vercel (frontend) + Render (backend)

## Project Structure

```
VPTC_AI_chatbot/
├── frontend/                 # Next.js application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                # Utilities, Supabase client
│   └── types/              # TypeScript types
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Config, security
│   │   ├── models/         # Database models
│   │   └── services/       # Business logic
│   └── chromadb/           # ChromaDB data
├── docs/                   # Documentation
└── README.md               # This file
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Supabase account
- Google Gemini API key

### 1. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Run the SQL schema from `docs/supabase_schema.sql` in the Supabase SQL Editor
3. Note your Supabase URL and anon key from Project Settings > API

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
GEMINI_API_KEY=your_gemini_api_key
CHROMA_PERSIST_DIR=./chromadb
API_URL=http://localhost:8000
```

Run the backend:

```bash
python run.py
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features

### Core Chat
- Ask questions about the college, courses, and campus life
- Responses are grounded in college documents using RAG
- Personalized responses based on user profile

### Academic Advisor
- **Course Recommendations**: Get personalized course suggestions
- **Prerequisite Checker**: Verify eligibility for courses
- **GPA Simulator**: Calculate and project GPA

### Document Assistant
- Upload PDF documents
- Ask questions about document content
- Document-specific Q&A using RAG

## API Endpoints

### Authentication
- `GET /api/auth/verify` - Verify authentication token

### Chat
- `POST /api/chat` - Send chat message
- `GET /api/conversations` - Get conversation history

### Documents
- `POST /api/documents/upload` - Upload a PDF document
- `GET /api/documents/list` - List user's documents

### Academic Advisor
- `GET /api/advisor/recommendations` - Get course recommendations
- `POST /api/advisor/check-prerequisite` - Check course prerequisites
- `POST /api/advisor/calculate-gpa` - Calculate GPA
- `GET /api/advisor/gpa-simulator` - Simulate GPA scenarios

## Development

### Adding College Documents

To add college documents to the knowledge base:

1. Place PDF files in a `documents/` directory
2. Use the document upload feature in the app, or
3. Create a script to bulk upload documents to ChromaDB

### Environment Variables

See `.env.example` files in both `frontend/` and `backend/` directories for required environment variables.

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

## License

This project is part of a final year project for Vignesh Polytechnic College.

## Author

M Srivijay - Diploma in Computer Science Engineering (DCT)








