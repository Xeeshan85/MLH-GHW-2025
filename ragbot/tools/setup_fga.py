import asyncio
import os
import csv
from policies.fga_client import FGAClient
from openfga_sdk.exceptions import ValidationException

def load_manifest():
    """Load document manifest to get actual document IDs."""
    base_dir = os.path.dirname(os.path.dirname(__file__))
    manifest_path = os.path.join(base_dir, "data", "manifest.csv")
    with open(manifest_path, encoding="utf-8") as f:
        return list(csv.DictReader(f))

async def safe_write(coro, description):
    """Execute a write operation, ignoring 'already exists' errors."""
    try:
        await coro
        return True
    except ValidationException as e:
        if "already exist" in str(e):
            return False  # Tuple already exists, skip
        raise

async def setup_fga_permissions():
    """Seed FGA with permissions based on actual documents in manifest."""
    client = FGAClient()
    await client.connect()
    
    try:
        # Define users and their departments/tenants
        users = {
            "alice": {"department": "genomics", "role": "manager", "tenant": "U1_genomics"},
            "bob": {"department": "nlp", "role": "employee", "tenant": "U2_nlp"},
            "carol": {"department": "genomics", "role": "employee", "tenant": "U1_genomics"},
            "dave": {"department": "robotics", "role": "manager", "tenant": "U3_robotics"},
        }
        
        # Add users to departments
        print("\nSetting up user-department relationships...")
        for user_id, info in users.items():
            added = await safe_write(
                client.add_user_to_department(user_id, info["department"]),
                f"{user_id} → {info['department']}"
            )
            status = "✓ Added" if added else "○ Exists"
            print(f"  {status} {user_id} to department:{info['department']}")
        
        # Load actual documents from manifest
        manifest = load_manifest()
        print(f"\nFound {len(manifest)} documents in manifest")
        
        # Grant department access based on tenant
        tenant_to_dept = {
            "U1_genomics": "genomics",
            "U2_nlp": "nlp",
            "U3_robotics": "robotics",
            "U4_materials": "materials",
        }
        
        print("\n🔐 Setting up document permissions...")
        
        # Group documents by tenant
        by_tenant = {}
        for row in manifest:
            tenant = row["tenant"]
            by_tenant.setdefault(tenant, []).append(row["doc_id"])
        
        # Grant department access to tenant documents
        for tenant, doc_ids in by_tenant.items():
            if tenant == "PUB":
                # Public documents - grant to all users
                print(f"\n  📂 Public documents ({len(doc_ids)} docs) - granting to all users")
                for doc_id in doc_ids:
                    for user_id in users.keys():
                        await safe_write(
                            client.add_document_permission(user_id, doc_id, "viewer"),
                            f"{doc_id} → {user_id}"
                        )
                    print(f"    ✓ {doc_id} → all users")
            else:
                # Private tenant documents - grant to department
                dept = tenant_to_dept.get(tenant)
                if dept:
                    print(f"\n  📂 {tenant} documents ({len(doc_ids)} docs) → department:{dept}")
                    for doc_id in doc_ids:
                        await safe_write(
                            client.add_department_access(doc_id, dept),
                            f"{doc_id} → {dept}"
                        )
                        print(f"    ✓ {doc_id} → {dept}")
        
        # Manager-only sensitive documents (first memo from each tenant)
        print("\n🔒 Setting up manager-only documents...")
        sensitive_docs = ["L1_genomics_memo_01", "L2_nlp_memo_01", "L3_robotics_memo_01"]
        managers = [u for u, info in users.items() if info["role"] == "manager"]
        
        for doc_id in sensitive_docs:
            for manager in managers:
                await safe_write(
                    client.add_document_permission(manager, doc_id, "viewer"),
                    f"{doc_id} → {manager}"
                )
            print(f"  ✓ {doc_id} → managers only ({', '.join(managers)})")
        
        print("\n✅ FGA permissions setup complete!")
        print("\nSummary:")
        print(f"  - Users: {list(users.keys())}")
        print(f"  - Departments: genomics, nlp, robotics, materials")
        print(f"  - Total documents: {len(manifest)}")
        
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(setup_fga_permissions())