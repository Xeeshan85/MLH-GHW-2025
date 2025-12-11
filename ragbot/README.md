# RAGBot - Knowledge Assistant with Fine-Grained Authorization

A secure internal-facing knowledge assistant that enforces document-level access control using **Auth0 FGA (Fine-Grained Authorization)** with RAG (Retrieval-Augmented Generation).

## Overview

This project demonstrates how to build a knowledge assistant that:
- Sources answers from a document database using RAG
- Enforces document-level access based on user identity and role
- Denies access to sensitive documents even if they exist in the RAG index

## Key Features

- **Fine-Grained Authorization**: Auth0 FGA integration for document-level access control
- **Role-Based Access**: Managers vs employees, department-based permissions
- **RAG Pipeline**: Vector search with ChromaDB and sentence transformers
- **PII Protection**: Automatic masking of sensitive data patterns
- **Multi-Tenant Support**: Isolated data access per tenant/department

## Tech Stack

- Python 3.11+
- Auth0 FGA (OpenFGA SDK)
- ChromaDB (Vector Database)
- Sentence Transformers
- Groq LLM

## Quick Start

### 1. Setup Environment

```bash
cd ragbot
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
FGA_API_URL=https://api.us1.fga.dev
FGA_STORE_ID=your_store_id
FGA_CLIENT_ID=your_client_id
FGA_CLIENT_SECRET=your_client_secret
FGA_MODEL_ID=your_model_id
```

### 3. Setup Auth0 FGA

1. Create a store at [dashboard.fga.dev](https://dashboard.fga.dev)
2. Create an authorization model (see `auth-model.fga`)
3. Run the setup script to seed permissions:

```bash
python -m tools.setup_fga
```

### 4. Run the Application

```bash
# With FGA authorization (user-based access control)
python -m app.main --user alice --query "What is the salary information?"

# With tenant-specific document retrieval
python -m app.main --user alice --tenant U1 --query "What PPE is required in wet labs?"
```

### 5. Run Tests

```bash
python -m tests.test_fga
pytest -q
```

## Authorization Model

The FGA model defines:
- **Users** belong to **Departments**
- **Documents** have **parent_department** relationships
- **Viewers** can be direct users, owners, or department members

Example access rules:
| User | Document | Access |
|------|----------|--------|
| alice (HR Manager) | salary_Q4 | ✅ Allowed |
| bob (Engineer) | salary_Q4 | ❌ Denied |
| alice (Manager) | budget_Q4 | ✅ Allowed |
| carol (HR Employee) | budget_Q4 | ❌ Denied |

## Project Structure

```
ragbot/
├── app/              # Main application
├── agents/           # LLM and controller logic
├── policies/         # FGA client and guard policies
├── retrieval/        # Vector search and indexing
├── data/             # Documents and ACL config
├── tests/            # Test suites
└── tools/            # Setup and utility scripts
```

## License

ISC License


## 8. Clear tenant memory (helper)

python app/clear_memory.py --tenant U2


## 9. Helpful tweaks (config.yaml)
- For deterministic outputs set `llm.temperature: 0.0`.
- To limit snippets sent to LLM, edit `agents/controller.py` and cap `hits[:3]`.


## 10. Quick full run (one-liner)

python -m app.main --tenant U1 --query "What PPE is required in wet labs?"
python -m tools.run_redteam --config config.yaml
PYTHONPATH=. pytest -q
