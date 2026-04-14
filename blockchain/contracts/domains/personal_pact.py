import os

from pyteal import *

from contracts.core.pact_escrow import (
    approval_program as core_approval_program,
    clear_program as core_clear_program,
)


KEY_GOAL_TYPE = Bytes("goal_type")
KEY_TARGET_METRIC = Bytes("target_metric")
KEY_CURRENT_PROGRESS = Bytes("current_progress")
KEY_AUTO_VERIFY_PLATFORM = Bytes("auto_verify_platform")


def approval_program() -> Expr:
    set_personal_meta = Seq(
        Assert(Txn.application_args.length() >= Int(5)),
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        App.globalPut(KEY_GOAL_TYPE, Txn.application_args[1]),
        App.globalPut(KEY_TARGET_METRIC, Btoi(Txn.application_args[2])),
        App.globalPut(KEY_CURRENT_PROGRESS, Int(0)),
        App.globalPut(KEY_AUTO_VERIFY_PLATFORM, Txn.application_args[3]),
        App.globalPut(Bytes("verifier"), Txn.application_args[4]),
        Approve(),
    )

    update_progress = Seq(
        Assert(Txn.sender() == App.globalGet(Bytes("verifier"))),
        Assert(Txn.application_args.length() >= Int(2)),
        App.globalPut(KEY_CURRENT_PROGRESS, Btoi(Txn.application_args[1])),
        Approve(),
    )

    auto_complete = Seq(
        Assert(App.globalGet(KEY_CURRENT_PROGRESS) >= App.globalGet(KEY_TARGET_METRIC)),
        App.globalPut(Bytes("status"), Bytes("completed")),
        Approve(),
    )

    return Cond(
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("set_personal_meta"),
            ),
            set_personal_meta,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("update_progress"),
            ),
            update_progress,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("auto_complete"),
            ),
            auto_complete,
        ],
        [Int(1), core_approval_program()],
    )


def clear_program() -> Expr:
    return core_clear_program()


if __name__ == "__main__":
    os.makedirs("build", exist_ok=True)
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_program(), mode=Mode.Application, version=8)
    with open("build/personal_pact_approval.teal", "w", encoding="utf-8") as f:
        f.write(approval)
    with open("build/personal_pact_clear.teal", "w", encoding="utf-8") as f:
        f.write(clear)
    print("Personal contract compiled")
