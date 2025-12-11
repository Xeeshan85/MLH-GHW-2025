import os
from openfga_sdk import OpenFgaClient, ClientConfiguration
from openfga_sdk.client.models import ClientCheckRequest, ClientTuple, ClientWriteRequest
from openfga_sdk.credentials import Credentials, CredentialConfiguration
from dotenv import load_dotenv
load_dotenv()

class FGAClient:
    def __init__(self):
        # Build credentials properly using SDK classes
        credentials = Credentials(
            method="client_credentials",
            configuration=CredentialConfiguration(
                client_id=os.getenv("FGA_CLIENT_ID"),
                client_secret=os.getenv("FGA_CLIENT_SECRET"),
                api_audience="https://api.us1.fga.dev/",
                api_issuer="auth.fga.dev"
            )
        )
        
        self.config = ClientConfiguration(
            api_url=os.getenv("FGA_API_URL", "https://api.us1.fga.dev"),
            store_id=os.getenv("FGA_STORE_ID"),
            authorization_model_id=os.getenv("FGA_MODEL_ID"),
            credentials=credentials
        )
        self.client = None

    async def connect(self):
        self.client = OpenFgaClient(self.config)
        await self.client.__aenter__()
        return self

    async def close(self):
        if self.client:
            await self.client.__aexit__(None, None, None)

    async def check_access(self, user_id: str, document_id: str, relation: str = "viewer") -> bool:
        """Check if user has access to a document."""
        request = ClientCheckRequest(
            user=f"user:{user_id}",
            relation=relation,
            object=f"document:{document_id}"
        )
        response = await self.client.check(request)
        return response.allowed

    async def add_document_permission(self, user_id: str, document_id: str, relation: str = "viewer"):
        """Grant user access to a document."""
        await self.client.write(ClientWriteRequest(
            writes=[
                ClientTuple(
                    user=f"user:{user_id}",
                    relation=relation,
                    object=f"document:{document_id}"
                )
            ]
        ))

    async def add_department_access(self, document_id: str, department: str):
        """Grant department access to a document."""
        await self.client.write(ClientWriteRequest(
            writes=[
                ClientTuple(
                    user=f"department:{department}",
                    relation="parent_department",
                    object=f"document:{document_id}"
                )
            ]
        ))

    async def add_user_to_department(self, user_id: str, department: str):
        """Add user to a department."""
        await self.client.write(ClientWriteRequest(
            writes=[
                ClientTuple(
                    user=f"user:{user_id}",
                    relation="member",
                    object=f"department:{department}"
                )
            ]
        ))