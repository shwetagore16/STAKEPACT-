from dotenv import load_dotenv
import os

load_dotenv()

ALGOD_URL = os.getenv("ALGORAND_NODE_URL", "https://testnet-api.algonode.cloud")
ALGOD_TOKEN = os.getenv("ALGORAND_NODE_TOKEN", "")  # empty for AlgoNode
INDEXER_URL = os.getenv("ALGORAND_INDEXER_URL", "https://testnet-idx.algonode.cloud")
DEPLOYER_MNEMONIC = os.getenv("DEPLOYER_MNEMONIC")
APP_ID = int(os.getenv("APP_ID", "0"))


def get_algod_client():
    from algosdk.v2client import algod

    headers = {"X-Algo-API-Token": ALGOD_TOKEN} if ALGOD_TOKEN else {}
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_URL, headers)


def get_deployer_account():
    from algosdk import mnemonic

    if not DEPLOYER_MNEMONIC:
        raise ValueError("DEPLOYER_MNEMONIC is not set in environment")

    private_key = mnemonic.to_private_key(DEPLOYER_MNEMONIC)
    address = mnemonic.to_public_key(DEPLOYER_MNEMONIC)
    return private_key, address
