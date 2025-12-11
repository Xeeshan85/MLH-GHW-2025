from __future__ import annotations
import re
from typing import List, TYPE_CHECKING
from .index import Hit

if TYPE_CHECKING:
    from policies.guard import DocumentGuard

PII_PATTERNS = [
    re.compile(r"\b\d{5}-\d{7}-\d\b"),
    re.compile(r"\+?92-?\d{3}-?\d{7}"),
]


class SecureSearch:
    def __init__(self, index):
        self.index = index
        self._guard = None
    
    @property
    def guard(self):
        """Lazy load DocumentGuard to avoid circular import."""
        if self._guard is None:
            from policies.guard import DocumentGuard
            self._guard = DocumentGuard()
        return self._guard

    async def search(self, query: str, user_id: str, top_k: int = 5) -> list:
        """Search with access control filtering."""
        # Get raw search results
        raw_results = self.index.search(query, top_k=top_k * 2)  # Get more to account for filtering
        
        # Filter based on FGA permissions
        filtered_results = await self.guard.filter_documents(user_id, raw_results)
        
        # Return only top_k after filtering
        return filtered_results[:top_k]

def mask_pii(text: str) -> str:
    out = text
    for pat in PII_PATTERNS:
        out = pat.sub("[REDACTED]", out)
    return out

def policy_guard(hits: List[Hit], active_tenant: str) -> List[Hit] | dict:
    safe = []
    for h in hits:
        if h.tenant == "public" or h.visibility == "public":
            safe.append(h); continue
        if h.tenant != active_tenant:
            continue
        masked = mask_pii(h.text)
        h.pii_masked = (masked != h.text)
        h.text = masked
        safe.append(h)
    if not safe:
        return {"refusal":"AccessDenied","reason":"No retrievable documents under current ACL."}
    return safe
