import asyncio
import os
from policies.fga_client import FGAClient

async def setup_fga_permissions():
    """Seed FGA with initial permissions based on your use case."""
    client = FGAClient()
    await client.connect()
    
    try:
        # Define users and their departments
        users = {
            "alice": {"department": "hr", "role": "manager"},
            "bob": {"department": "engineering", "role": "employee"},
            "carol": {"department": "hr", "role": "employee"},
            "dave": {"department": "legal", "role": "manager"},
        }
        
        # Add users to departments
        for user_id, info in users.items():
            await client.add_user_to_department(user_id, info["department"])
            print(f"Added {user_id} to department:{info['department']}")
        
        # Define document permissions
        # HR documents - only HR department can view
        hr_documents = ["salary_Q4", "benefits_2024", "employee_reviews"]
        for doc in hr_documents:
            await client.add_department_access(doc, "hr")
            print(f"Granted hr department access to {doc}")
        
        # Public documents - everyone can view (add specific users)
        public_docs = ["company_policy", "holiday_schedule"]
        for doc in public_docs:
            for user_id in users.keys():
                await client.add_document_permission(user_id, doc, "viewer")
            print(f"Granted all users access to {doc}")
        
        # Manager-only documents
        manager_docs = ["budget_Q4", "headcount_plan"]
        for doc in manager_docs:
            # Only managers get access
            await client.add_document_permission("alice", doc, "viewer")  # HR manager
            await client.add_document_permission("dave", doc, "viewer")   # Legal manager
            print(f"Granted managers access to {doc}")
        
        print("\n✅ FGA permissions setup complete!")
        
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(setup_fga_permissions())