import argparse, os, yaml
from agents.controller import agent
import asyncio
from dotenv import load_dotenv
from retrieval.index import DocumentIndex
from retrieval.search import SecureSearch

load_dotenv()

class RAGBot:
    def __init__(self):
        self.index = DocumentIndex()
        self.secure_search = SecureSearch(self.index)
    
    async def query(self, user_id: str, question: str) -> str:
        """Process a user query with access control."""
        
        # Search with FGA filtering
        relevant_docs = await self.secure_search.search(
            query=question,
            user_id=user_id,
            top_k=5
        )
        
        if not relevant_docs:
            return "I don't have access to documents that could answer your question, or you don't have permission to view them."
        
        # Build context from allowed documents
        context = "\n\n".join([doc.get("content", "") for doc in relevant_docs])
        
        # Generate response using LLM (your existing logic)
        response = await self.generate_response(question, context)
        
        return response
    
    async def generate_response(self, question: str, context: str) -> str:
        # Your existing LLM logic here
        pass



def load_cfg(path: str):
    if path and os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    return {}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--tenant", required=True, help="U1, U2, U3, U4")
    p.add_argument("--query", required=True)
    p.add_argument("--config", default="config.yaml")
    p.add_argument("--memory", choices=["buffer","summary"], default="summary")
    args = p.parse_args()

    cfg = load_cfg(args.config)
    base_dir = os.path.dirname(os.path.dirname(__file__))

    class _Mem: pass
    mem = _Mem(); mem.kind = args.memory

    print(agent(base_dir, args.tenant, args.query, cfg, memory=mem))

if __name__ == "__main__":
    main()
