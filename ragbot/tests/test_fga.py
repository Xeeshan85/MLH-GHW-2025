import asyncio
from policies.fga_client import FGAClient

async def test_access_control():
    client = FGAClient()
    await client.connect()
    
    try:
        # Test cases
        tests = [
            ("alice", "salary_Q4", True, "HR manager should access salary docs"),
            ("bob", "salary_Q4", False, "Engineer should NOT access salary docs"),
            ("alice", "budget_Q4", True, "Manager should access budget"),
            ("carol", "budget_Q4", False, "HR employee should NOT access budget"),
            ("bob", "company_policy", True, "Everyone should access public docs"),
        ]
        
        print("Running FGA Access Control Tests\n" + "="*50)
        
        for user_id, doc_id, expected, description in tests:
            result = await client.check_access(user_id, doc_id)
            status = "✅ PASS" if result == expected else "❌ FAIL"
            print(f"{status}: {description}")
            print(f"       user:{user_id} -> document:{doc_id} = {result} (expected: {expected})\n")
        
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(test_access_control())