import os

from pyteal import *

from contracts.core.pact_escrow import (
    approval_program as core_approval_program,
    clear_program as core_clear_program,
)


KEY_JURISDICTION = Bytes("jurisdiction")
KEY_CASE_NUMBER = Bytes("case_number")
KEY_DOCUMENT_HASH = Bytes("document_hash")
KEY_VERIFIER_ROLE = Bytes("verifier_role")
KEY_DOCUMENT_VERIFIED = Bytes("document_verified")


def approval_program() -> Expr:
    set_legal_meta = Seq(
        Assert(Txn.application_args.length() >= Int(5)),
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        App.globalPut(KEY_JURISDICTION, Txn.application_args[1]),
        App.globalPut(KEY_CASE_NUMBER, Txn.application_args[2]),
        App.globalPut(KEY_DOCUMENT_HASH, Txn.application_args[3]),
        App.globalPut(KEY_VERIFIER_ROLE, Txn.application_args[4]),
        App.globalPut(KEY_DOCUMENT_VERIFIED, Int(0)),
        Approve(),
    )

    submit_document_hash = Seq(
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        Assert(Txn.application_args.length() >= Int(2)),
        App.globalPut(KEY_DOCUMENT_HASH, Txn.application_args[1]),
        App.globalPut(KEY_DOCUMENT_VERIFIED, Int(0)),
        Approve(),
    )

    verify_document = Seq(
        Assert(Txn.sender() == App.globalGet(Bytes("verifier"))),
        App.globalPut(KEY_DOCUMENT_VERIFIED, Int(1)),
        App.globalPut(Bytes("status"), Bytes("completed")),
        Approve(),
    )

    return Cond(
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("set_legal_meta"),
            ),
            set_legal_meta,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("submit_document_hash"),
            ),
            submit_document_hash,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("verify_document"),
            ),
            verify_document,
        ],
        [Int(1), core_approval_program()],
    )


def clear_program() -> Expr:
    return core_clear_program()


if __name__ == "__main__":
    os.makedirs("build", exist_ok=True)
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_program(), mode=Mode.Application, version=8)
    with open("build/legal_pact_approval.teal", "w", encoding="utf-8") as f:
        f.write(approval)
    with open("build/legal_pact_clear.teal", "w", encoding="utf-8") as f:
        f.write(clear)
    print("Legal contract compiled")
