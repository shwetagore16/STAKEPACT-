# StakePact Blockchain Module

This module contains PyTeal contracts and deployment utilities for the StakePact escrow workflow.

## Structure

- `contracts/core/pact_escrow.py`: Core escrow app logic and TEAL compilation entrypoint.
- `contracts/domains/*_pact.py`: Domain metadata adapters used by backend/frontend orchestration.
- `deploy/deploy.py`: Script that compiles contracts and emits artifact metadata.
- `tests/test_pact.py`: Contract metadata validation tests.

## Local Setup

1. Create a virtual environment and activate it.
2. Install dependencies:

```bash
pip install pyteal pytest
```

3. Copy environment template:

```bash
cp .env.example .env
```

4. Compile TEAL artifacts:

```bash
python deploy/deploy.py
```

5. Run tests:

```bash
pytest
```
