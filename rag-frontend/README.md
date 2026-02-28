# RAG Frontend

A production-ready React.js frontend for the Agentic RAG Chatbot system.

## Features

- 🔐 Role-based authentication (Admin, HR, Employee)
- 💬 Modern chat interface with markdown support
- 📂 Document ingestion (file, folder, URL)
- 📝 Feedback collection system
- 📊 Admin dashboard with analytics
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design

## Tech Stack

- React 18
- React Router v6
- Material UI v5
- Axios
- Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

````bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
Environment Variables
Create a .env file:

env

VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=RAG Assistant
Project Structure
text

src/
├── app/          # App bootstrap
├── assets/       # Static assets
├── components/   # Reusable components
├── context/      # React contexts
├── features/     # Feature modules
├── hooks/        # Custom hooks
├── pages/        # Route pages
├── services/     # API services
└── utils/        # Utilities
API Endpoints
The frontend expects these backend endpoints:

POST /query - Send chat queries
POST /ingest/file - Upload files
POST /ingest/folder - Ingest folder
POST /ingest/url - Ingest URL
POST /feedback - Submit feedback
GET /admin/stats - Get statistics
GET /admin/logs - Get system logs
License
MIT

text


---

## ✅ Complete!

That's the entire frontend codebase! Here's a summary of what's included:

### Files Created:
1. **Configuration**: `package.json`, `.env`, `vite.config.js`, `appConfig.js`
2. **Entry Points**: `main.jsx`, `App.jsx`, `index.html`
3. **Routing**: `routes.jsx`, `providers.jsx`
4. **Contexts**: `ThemeContext.jsx`, `ToastContext.jsx`, `authContext.jsx`
5. **Services**: `apiClient.js`, `endpoints.js`, feature services
6. **Hooks**: `useAuth.js`, `useChat.js`, `useToast.js`
7. **UI Components**: `Button`, `Input`, `Card`, `Loader`, `Toast`
8. **Chat Components**: `ChatMessage`, `ChatInput`, `ChatWindow`, `SourceList`, `AgentStepsToggle`
9. **Layout Components**: `MainLayout`, `Sidebar`, `Navbar`, `ThemeToggle`
10. **Common Components**: `ProtectedRoute`, `ErrorBoundary`, `EmptyState`
11. **Pages**: `LoginPage`, `ChatPage`, `IngestionPage`, `FeedbackPage`, `AdminDashboard`
12. **Utilities**: `constants.js`, `rolePermissions.js`
13. **Styles**: `globals.css`

### To Run:
```bash
npm install
npm run dev
````
