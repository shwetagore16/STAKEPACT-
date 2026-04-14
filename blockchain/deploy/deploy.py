from algosdk import transaction, encoding
from algosdk.v2client import algod
from config import get_algod_client, get_deployer_account
import base64, os, sys


def compile_contract(client, source_code: str) -> bytes:
    compile_response = client.compile(source_code)
    return base64.b64decode(compile_response['result'])


def deploy_pact_contract(client, private_key, address, approval_teal, clear_teal):
    approval_program = compile_contract(client, approval_teal)
    clear_program = compile_contract(client, clear_teal)

    global_schema = transaction.StateSchema(num_uints=10, num_byte_slices=6)
    local_schema = transaction.StateSchema(num_uints=5, num_byte_slices=1)

    sp = client.suggested_params()

    txn = transaction.ApplicationCreateTxn(
        sender=address,
        sp=sp,
        on_complete=transaction.OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=global_schema,
        local_schema=local_schema,
    )
    signed = txn.sign(private_key)
    tx_id = client.send_transaction(signed)
    print(f"Deploying... TX: {tx_id}")

    result = transaction.wait_for_confirmation(client, tx_id, 4)
    app_id = result['application-index']
    print(f"✅ Deployed! App ID: {app_id}")
    return app_id


def main():
    client = get_algod_client()
    private_key, address = get_deployer_account()
    print(f"Deployer: {address}")

    # Read compiled TEAL
    with open("build/pact_escrow_approval.teal", encoding="utf-8") as f:
        approval_teal = f.read()
    with open("build/pact_escrow_clear.teal", encoding="utf-8") as f:
        clear_teal = f.read()

    app_id = deploy_pact_contract(client, private_key, address, approval_teal, clear_teal)

    # Save app_id to .env
    with open("../.env", "a", encoding="utf-8") as f:
        f.write(f"\nAPP_ID={app_id}\n")
    print("App ID saved to .env")


if __name__ == "__main__":
    main()
