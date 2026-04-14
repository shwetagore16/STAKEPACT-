import os

from pyteal import *

from contracts.core.pact_escrow import (
    approval_program as core_approval_program,
    clear_program as core_clear_program,
)


KEY_EXAM_DATE = Bytes("exam_date")
KEY_LMS_VERIFIED = Bytes("lms_verified")
KEY_CIRCLE_NAME = Bytes("circle_name")


def approval_program() -> Expr:
    set_education_meta = Seq(
        Assert(Txn.application_args.length() >= Int(4)),
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        App.globalPut(KEY_EXAM_DATE, Btoi(Txn.application_args[1])),
        App.globalPut(KEY_CIRCLE_NAME, Txn.application_args[2]),
        App.globalPut(KEY_LMS_VERIFIED, Btoi(Txn.application_args[3])),
        Approve(),
    )

    set_lms_verified = Seq(
        Assert(Txn.sender() == App.globalGet(Bytes("verifier"))),
        App.globalPut(KEY_LMS_VERIFIED, Int(1)),
        App.globalPut(Bytes("status"), Bytes("completed")),
        Approve(),
    )

    return Cond(
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("set_education_meta"),
            ),
            set_education_meta,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("set_lms_verified"),
            ),
            set_lms_verified,
        ],
        [Int(1), core_approval_program()],
    )


def clear_program() -> Expr:
    return core_clear_program()


if __name__ == "__main__":
    os.makedirs("build", exist_ok=True)
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_program(), mode=Mode.Application, version=8)
    with open("build/education_pact_approval.teal", "w", encoding="utf-8") as f:
        f.write(approval)
    with open("build/education_pact_clear.teal", "w", encoding="utf-8") as f:
        f.write(clear)
    print("Education contract compiled")
