```markdown
# Agentic RAG Assistant

A Full-Stack Role-Based HR & IT Knowledge Assistant

An **Agentic Retrieval-Augmented Generation (RAG)** system designed for HR policies and IT asset management, featuring:

- 🧠 **LangGraph-based multi-step agent orchestration**
- 🔎 **Hybrid retrieval (BGE embeddings + ChromaDB + optional BM25)**
- ⚡ **Groq LLM (primary) with Ollama TinyLLaMA fallback**
- 🔐 **RBAC-based content filtering**
- 🗂️ Flexible ingestion (file, folder, URL)
- 💬 Modern React frontend
- 📊 Admin analytics & feedback logging
- 🧠 Conversation memory per user
- 🌙 Dark/light theme UI

This project is modular, production-oriented, and built for secure enterprise knowledge access.

---

# 🏗️ System Architecture
```

User (Frontend)
↓
FastAPI Backend (/query)
↓
LangGraph Agent (Planner)
↓
Tool Selection:

- Knowledge Base (Chroma)
- Local Directory Search
  ↓
  RBAC Filtering
  ↓
  LLM (Groq → Ollama fallback)
  ↓
  Memory Save
  ↓
  Response (Answer + Sources + Steps)

```

---

# 📦 Full Project Structure

```

full_project/
│
├── backend/
│ ├── config/
│ ├── data/
│ ├── src/
│ ├── cli/
│ ├── api/
│ ├── requirements.txt
│ └── README.md
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ ├── vite.config.js
│ └── .env
│
└── README.md ← (this file)

```

---

# 🚀 Backend – Agentic RAG System

## 🔧 Core Technologies

- **LangGraph** – Multi-step agent orchestration
- **Groq LLM** – Primary model (`llama-3.3-70b-versatile`)
- **Ollama TinyLLaMA** – Local fallback
- **BAAI/bge-small-en-v1.5** – Embeddings
- **ChromaDB** – Persistent vector store
- **FastAPI** – REST API
- **Hybrid Retrieval** – Dense + lexical (optional)

---

## 🔐 Key Backend Features

### 1️⃣ Agentic Planning
The LLM planner dynamically chooses:

- `KB_SEARCH`
- `LOCAL_SEARCH`
- `ANSWER`

### 2️⃣ RBAC Enforcement
Documents filtered by:

- `role` → `admin | hr | employee`
- `metadata.visibility`
- `metadata.owner_user_id`

Unauthorized content never reaches the LLM.

### 3️⃣ Conversation Memory
Stored under:

```

data/memory/

```

Tracks:
- Recent chat turns
- Simple user profile

### 4️⃣ Flexible Ingestion

Supported file types:
- CSV
- XLSX
- JSON
- TXT
- MD
- YAML
- PDF
- DOC/DOCX

Supports:
- Single file
- Folder (recursive)
- Remote URL

---

## 🧠 Backend API Endpoints

### Main Chat

```

POST /query

````

Request:
```json
{
  "question": "What is the laptop replacement policy?",
  "user_id": "emp_123",
  "role": "employee"
}
````

Response:

```json
{
  "answer": "...",
  "steps": ["load_memory", "plan:KB_SEARCH", "generate_answer"],
  "context_sources": ["data/hr_policies/laptop_policy.md"]
}
```

---

### Ingestion

```
POST /ingest/file
POST /ingest/folder
POST /ingest/url
```

---

### Feedback

```
POST /feedback
```

Stored in:

```
logs/feedback.jsonl
```

---

### Admin (Optional Extension)

```
GET /admin/stats
GET /admin/logs
```

---

## 🖥️ Backend Setup

### 1️⃣ Clone & Create Environment

```bash
git clone <repo>
cd backend
python -m venv .venv
```

Activate:

**Windows**

```bash
.\.venv\Scripts\Activate.ps1
```

**Linux/macOS**

```bash
source .venv/bin/activate
```

Install:

```bash
pip install -r requirements.txt
```

---

## 🔑 Environment Variables

### Groq (Recommended)

```bash
export GROQ_API_KEY="sk_your_key"
```

### Ollama (Fallback)

```bash
ollama pull tinyllama
```

---

## ⚙️ Configuration

Located in:

```
config/settings.yaml
config/paths.yaml
config/model.yaml
```

Example:

```yaml
llm:
  provider_priority:
    - groq
    - ollama
  temperature: 0.1
```

---

## ▶️ Run Backend

```bash
uvicorn api.main:app --reload --port 8000
```

Docs:

```
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend – React RAG Interface

A production-ready UI built with:

- React 18
- React Router v6
- Material UI v5
- Axios
- Vite

---

## 🎯 Frontend Features

- 🔐 Role-based login (Admin / HR / Employee)
- 💬 Chat with markdown support
- 📂 Document ingestion UI
- 📝 Feedback submission
- 📊 Admin analytics dashboard
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive

---

## 📁 Frontend Structure

```
src/
├── app/
├── components/
├── context/
├── features/
├── hooks/
├── pages/
├── services/
└── utils/
```

---

## ⚙️ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌍 Frontend Environment Variables

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=RAG Assistant
```

---

# 🔄 End-to-End Flow

1. User logs in (role assigned)
2. Sends query from React UI
3. Backend agent:
   - Loads memory
   - Plans action
   - Retrieves documents
   - Applies RBAC
   - Generates grounded answer

4. Response returned with:
   - Answer
   - Context sources
   - Agent steps

5. User can submit feedback

---

# 🔐 Security Considerations

- RBAC enforced before generation
- Optional PII detection (disabled by default)
- Logs stored locally
- No external knowledge used unless ingested
- Memory scoped per user

---

# 📊 Production Readiness Checklist

✔ Modular architecture
✔ Swappable LLM providers
✔ Hybrid retrieval
✔ Feedback logging
✔ Role-based UI
✔ Theming support
✔ Clear API boundaries

Recommended production additions:

- Redis for distributed memory
- PostgreSQL for metadata persistence
- Dockerization
- CI/CD pipeline
- API authentication (JWT/OAuth)
- HTTPS + reverse proxy (Nginx)

---

# 🧪 Development Tips

- Start with small datasets before large ingestion.
- Keep metadata clean for effective RBAC.
- Monitor `logs/app.log` for debugging.
- Tune `top_k` and `min_relevance_score` for retrieval precision.

---

# 📜 License

MIT License

---

# 🏁 Final Summary

This project is a **full-stack, agentic, role-aware RAG system** designed for enterprise HR & IT knowledge management.

It combines:

- Intelligent orchestration (LangGraph)
- Secure retrieval (RBAC + Chroma)
- Flexible ingestion
- Feedback-driven evaluation
- Modern React interface

```

```
