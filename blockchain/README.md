# StakePact Blockchain

## Prerequisites
- Python 3.10+
- pip

## Setup

cd blockchain
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env with your deployer mnemonic

## Create Testnet Account
1. Go to https://bank.testnet.algorand.network/
2. Generate new account (or use AlgoKit)
3. Fund with test ALGO from faucet
4. Copy 25-word mnemonic to DEPLOYER_MNEMONIC in .env

## Compile Contracts
python contracts/core/pact_escrow.py
# Creates build/pact_escrow_approval.teal + build/pact_escrow_clear.teal

## Deploy to Testnet
python deploy/deploy.py
# Prints App ID, saves to .env automatically

## Run Tests
pytest tests/test_pact.py -v

## Contract Architecture

pact_escrow.py      — Core escrow: stake locking, release, forfeit
pact_verification.py — Vote tallying, threshold checking
education_pact.py   — LMS auto-verify extension
corporate_pact.py   — Milestone + counterparty co-sign
legal_pact.py       — Document hash + designated verifier
government_pact.py  — Public audit + watchdog forfeiture
personal_pact.py    — Progress tracking + auto-complete

## How it connects to Backend

Backend (Express) calls Algorand via py-algorand-sdk:
	POST /api/pacts → creates smart contract on-chain → stores app_id in Supabase
	POST /api/proof → submit proof → backend calls "submit_proof" on contract
	Votes cross threshold → backend calls "release_stake" inner transaction
