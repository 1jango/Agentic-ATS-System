# Agentic-CV-Screener

A high-performance, asynchronous AI recruitment system that automates CV screening using a multi-agent architecture. This project transforms raw PDF resumes into structured candidate profiles and evaluates them against specific job descriptions (JD).

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

## Project Structure
```text
├── agents/          # AI Agent logic and custom tools
├── api/             # FastAPI routes and endpoint definitions
├── models/          # Pydantic schemas and data contracts
├── services/        # PDF parsing and core business logic
├── utils/           # Logging utilities
├── samples/         # Sample CV + job description for manual testing
├── main.py          # Application entry point
└── requirements.txt # Project dependencies
