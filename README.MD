Agentic CV Screener

A high-performance ATS agent built with FastAPI and smolagents. Automates CV screening by converting PDF resumes to Markdown and using agentic reasoning to evaluate candidates against a job description.

## Key Features
- **Agentic Reasoning**: A `smolagents` CodeAgent extracts structured facts from the CV (name, employment history, skills) — it doesn't just match keywords.
- **Python-Powered Tools**: Custom tools (`calculate_experience`, `skill_match_validator`) do the actual years-of-experience and skill-matching math deterministically, to prevent LLM "hallucinations" in numbers.
- **Model Fallback**: Tries multiple Groq models in order (`qwen3.8-27b` → `qwen3.6-27b`) so a single model outage or deprecation doesn't break screening.

## Technical Stack
- **Backend**: FastAPI
- **Orchestration**: `smolagents` (HuggingFace)
- **LLM Gateway**: `LiteLLM` (currently configured for Groq)
- **Validation**: `Pydantic v2`
- **PDF Processing**: `PyMuPDF` (`pymupdf4llm`)
- **Frontend**: React + TypeScript (Vite)

## Project Structure
```text
├── agents/          # AI Agent logic and custom tools
├── api/             # FastAPI routes and endpoint definitions
├── models/          # Pydantic schemas and data contracts
├── services/        # PDF parsing and core business logic
├── utils/           # Logging utilities
├── frontend/        # React + TypeScript UI
├── main.py          # Application entry point
└── requirements.txt # Project dependencies
```

## Getting Started

### 1. Backend

```bash
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the project root (see `.env.example`):

```
GROQ_API_KEY=your-groq-api-key
```

Run the API:

```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend expects the backend at `http://localhost:8000` (configurable via `frontend/.env`, see `frontend/.env.example`).
