# Step 01. Install the SDK
# Install the SDK by following the steps at https://docs.fga.dev/integration/install-sdk
# pip3 install openfga_sdk
import asyncio

import openfga_sdk
from openfga_sdk.client import OpenFgaClient
from openfga_sdk.client.models import ClientCheckRequest
from openfga_sdk.credentials import Credentials, CredentialConfiguration

async def main():
  # Step 02. Initialize the SDK
  credentials = Credentials(
      method="client_credentials",
      configuration=CredentialConfiguration(
          api_issuer= "auth.fga.dev",
          api_audience= "https://api.us1.fga.dev/",
          client_id= "3IaUM8xop5Sjj2jzbeXUqNgVeseOr0Fv",
          client_secret= "Cm9kOoTc5pfYqLi3MuqA6CMZW12dEuB4JTU3rkgRrizilvS1Za0V3dgRoIV-KBLK",
      )
  )
  configuration = openfga_sdk.ClientConfiguration(
      api_url = "https://api.us1.fga.dev",
      store_id = "01KC70GQBY007PBHQ502ZJ1NHR",
      # model_id = 'YOUR_MODEL_ID', # Optionally, you can specify a model id to target, which can improve latency
      credentials = credentials,
  )

  async with OpenFgaClient(configuration) as fga_client:
      # Step 03. Check for access
      options = {}
      body = ClientCheckRequest(
          user="user:anne",
          relation="can_view",
          object="document:roadmap",
      )

      response = await fga_client.check(body, options)

      await fga_client.close() # close when done