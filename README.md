# Restaurant Order Chatbot

A full-stack restaurant ordering app with a React chat interface and a FastAPI backend. Customers chat with **Gita**, an AI waiter, to build a pizza restaurant order, review the current order details, and clear the conversation when needed.

## Features

- AI-powered ordering conversation using Groq
- Persistent chat history in PostgreSQL
- Current order tracking with items, customer details, status, and total amount
- Order review modal in the frontend
- Clear-chat flow that also resets saved order details
- Docker Compose setup for frontend, backend, and database

## Tech Stack

- Frontend: React 18, Vite
- Backend: FastAPI, SQLAlchemy, Uvicorn
- Database: PostgreSQL
- AI provider: Groq
- Containerization: Docker, Docker Compose

## Project Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── schemas/
│   │   ├── ai_service.py
│   │   ├── database.py
│   │   └── main.py
│   ├── db/schema.sql
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── deployment.md
```

## Environment Variables

Create a `.env` file in the project root before running with Docker:

```env
GROQ_API_KEY=your_groq_api_key
```

For local backend development, you can also create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=postgresql://waiter_user:password@localhost:5432/waiter_app
```

The Docker setup uses this database URL internally:

```text
postgresql://waiter_user:password@db:5432/waiter_app
```

## Run with Docker

From the project root:

```bash
docker compose up --build
```

Then open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5433`

To stop the app:

```bash
docker compose down
```

To stop the app and remove database data:

```bash
docker compose down -v
```

## Run Locally Without Docker

### 1. Start PostgreSQL

Run a PostgreSQL database with:

- Database: `waiter_app`
- User: `waiter_user`
- Password: `password`
- Port: `5432`

### 2. Start the Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend starts at `http://localhost:8000`.

### 3. Start the Frontend

In another terminal:

```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

The frontend starts at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Backend welcome route |
| `GET` | `/chat` | Get saved chat history |
| `POST` | `/chat` | Send a user message to the AI waiter |
| `DELETE` | `/chat` | Clear chat history and order details |
| `GET` | `/order` | Get the current saved order |

Example chat request:

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I want a medium cheese pizza and a Coke"}'
```

## Notes

- The backend creates database tables automatically on startup.
- CORS is configured for the local Vite frontend at `http://localhost:5173`.
- The AI prompt currently defines a pizza restaurant menu with prices in rupees.
