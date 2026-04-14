from __future__ import annotations

import json
import os
from pathlib import Path
import sys

from pyteal import Mode, compileTeal

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from contracts.core.pact_escrow import approval_program, clear_state_program


OUTPUT_DIR = Path(__file__).resolve().parent / 'artifacts'


def write_teal(filename: str, source: str) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    target = OUTPUT_DIR / filename
    target.write_text(source, encoding='utf-8')
    return target


def main() -> None:
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_state_program(), mode=Mode.Application, version=8)

    approval_path = write_teal('pact_escrow_approval.teal', approval)
    clear_path = write_teal('pact_escrow_clear.teal', clear)

    network = os.getenv('ALGORAND_NETWORK', 'testnet')
    report = {
        'network': network,
        'approval_program': str(approval_path),
        'clear_program': str(clear_path),
    }

    print(json.dumps(report, indent=2))


if __name__ == '__main__':
    main()
