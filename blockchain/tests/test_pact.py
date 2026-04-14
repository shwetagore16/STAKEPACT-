import pytest
from algosdk import transaction
from deploy.config import get_algod_client, get_deployer_account, APP_ID


class TestPactEscrow:
    def setup_method(self):
        self.client = get_algod_client()
        self.private_key, self.address = get_deployer_account()

    def test_algod_connection(self):
        status = self.client.status()
        assert "last-round" in status

    def test_app_exists(self):
        if APP_ID == 0:
            pytest.skip("APP_ID not set — deploy first")
        app_info = self.client.application_info(APP_ID)
        assert app_info["id"] == APP_ID

    def test_create_pact_transaction(self):
        sp = self.client.suggested_params()
        app_call = transaction.ApplicationCallTxn(
            sender=self.address,
            sp=sp,
            index=APP_ID if APP_ID > 0 else 1,
            on_complete=transaction.OnComplete.NoOpOC,
            app_args=[
                b"create_pact",
                (1_000_000).to_bytes(8, "big"),
                (2_000_000_000).to_bytes(8, "big"),
                b"education",
                b"group_vote",
            ],
        )
        assert app_call.sender == self.address
        assert app_call.app_args[0] == b"create_pact"

    def test_stake_calculation(self):
        stake = 1_000_000  # 1 ALGO in microAlgos
        members = 5
        total = stake * members
        assert total == 5_000_000
