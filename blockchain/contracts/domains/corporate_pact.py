import os

from pyteal import *

from contracts.core.pact_escrow import (
    approval_program as core_approval_program,
    clear_program as core_clear_program,
)


KEY_CONTRACT_VALUE = Bytes("contract_value")
KEY_MILESTONE_COUNT = Bytes("milestone_count")
KEY_MILESTONES_COMPLETED = Bytes("milestones_completed")
KEY_COUNTERPARTY = Bytes("counterparty")
KEY_CREATOR_SIGNED = Bytes("creator_signed")
KEY_COUNTERPARTY_SIGNED = Bytes("counterparty_signed")


def approval_program() -> Expr:
    set_corporate_meta = Seq(
        Assert(Txn.application_args.length() >= Int(4)),
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        App.globalPut(KEY_CONTRACT_VALUE, Btoi(Txn.application_args[1])),
        App.globalPut(KEY_MILESTONE_COUNT, Btoi(Txn.application_args[2])),
        App.globalPut(KEY_MILESTONES_COMPLETED, Int(0)),
        App.globalPut(KEY_COUNTERPARTY, Txn.application_args[3]),
        App.globalPut(KEY_CREATOR_SIGNED, Int(1)),
        App.globalPut(KEY_COUNTERPARTY_SIGNED, Int(0)),
        App.globalPut(Bytes("status"), Bytes("pending_cosign")),
        Approve(),
    )

    counterparty_sign = Seq(
        Assert(Txn.sender() == App.globalGet(KEY_COUNTERPARTY)),
        App.globalPut(KEY_COUNTERPARTY_SIGNED, Int(1)),
        If(
            App.globalGet(KEY_CREATOR_SIGNED) == Int(1),
            App.globalPut(Bytes("status"), Bytes("active")),
            App.globalPut(Bytes("status"), Bytes("pending_cosign")),
        ),
        Approve(),
    )

    complete_milestone = Seq(
        Assert(
            Or(
                Txn.sender() == App.globalGet(Bytes("verifier")),
                Txn.sender() == App.globalGet(KEY_COUNTERPARTY),
            )
        ),
        Assert(App.globalGet(KEY_MILESTONES_COMPLETED) < App.globalGet(KEY_MILESTONE_COUNT)),
        App.globalPut(
            KEY_MILESTONES_COMPLETED,
            App.globalGet(KEY_MILESTONES_COMPLETED) + Int(1),
        ),
        If(
            App.globalGet(KEY_MILESTONES_COMPLETED) >= App.globalGet(KEY_MILESTONE_COUNT),
            App.globalPut(Bytes("status"), Bytes("completed")),
        ),
        Approve(),
    )

    return Cond(
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("set_corporate_meta"),
            ),
            set_corporate_meta,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("counterparty_sign"),
            ),
            counterparty_sign,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("complete_milestone"),
            ),
            complete_milestone,
        ],
        [Int(1), core_approval_program()],
    )


def clear_program() -> Expr:
    return core_clear_program()


if __name__ == "__main__":
    os.makedirs("build", exist_ok=True)
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_program(), mode=Mode.Application, version=8)
    with open("build/corporate_pact_approval.teal", "w", encoding="utf-8") as f:
        f.write(approval)
    with open("build/corporate_pact_clear.teal", "w", encoding="utf-8") as f:
        f.write(clear)
    print("Corporate contract compiled")
