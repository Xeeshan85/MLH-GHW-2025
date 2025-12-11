from __future__ import annotations
from typing import List, Dict, Any, TYPE_CHECKING

if TYPE_CHECKING:
    from retrieval.index import Hit

import asyncio
from policies.fga_client import FGAClient

class DocumentGuard:
    def __init__(self):
        self.fga_client = FGAClient()
        self._connected = False

    async def ensure_connected(self):
        if not self._connected:
            await self.fga_client.connect()
            self._connected = True

    async def filter_documents(self, user_id: str, documents: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Filter documents based on user's FGA permissions."""
        await self.ensure_connected()
        
        allowed_docs = []
        for doc in documents:
            # Extract doc_id from various possible keys
            doc_id = doc.get("doc_id") or doc.get("id") or doc.get("document_id") or doc.get("filename", "").replace(".md", "")
            
            # Check FGA permission
            has_access = await self.fga_client.check_access(user_id, doc_id)
            
            if has_access:
                allowed_docs.append(doc)
            else:
                print(f"[FGA] Access DENIED: user:{user_id} → document:{doc_id}")
        
        if allowed_docs:
            print(f"[FGA] Access GRANTED: user:{user_id} → {len(allowed_docs)} documents")
        
        return allowed_docs

    async def check_single_document(self, user_id: str, document_id: str) -> bool:
        """Check if user can access a specific document."""
        await self.ensure_connected()
        return await self.fga_client.check_access(user_id, document_id)
    


def apply_policy(hits: List, tenant: str):
    """Apply policy filtering to hits - imports lazily to avoid circular import."""
    from retrieval.search import policy_guard
    return policy_guard(hits, tenant)

def refusal_template(kind: str, detail: str = "") -> str:
    templates = {
        "AccessDenied": "Refusal: AccessDenied. You do not have access to that information.",
        "LeakageRisk": "Refusal: LeakageRisk. Your request may expose private or PII data.",
        "InjectionDetected": "Refusal: InjectionDetected. Ignoring instructions that conflict with system policy."
    }
    return templates.get(kind, "Refusal.") + ((" " + detail) if detail else "")