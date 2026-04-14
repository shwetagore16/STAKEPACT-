import os

from pyteal import *


KEY_PACT_APP_ID = Bytes("pact_app_id")
KEY_VERIFIER_ADDRESS = Bytes("verifier_address")
KEY_REQUIRED_VOTES = Bytes("required_votes")
KEY_APPROVE_VOTES = Bytes("approve_votes")
KEY_REJECT_VOTES = Bytes("reject_votes")

LKEY_VOTED = Bytes("voted")


@Subroutine(TealType.uint64)
def is_creator() -> Expr:
    return Txn.sender() == Global.creator_address()


def approval_program() -> Expr:
    on_create = Seq(
        App.globalPut(KEY_PACT_APP_ID, Int(0)),
        App.globalPut(KEY_VERIFIER_ADDRESS, Global.zero_address()),
        App.globalPut(KEY_REQUIRED_VOTES, Int(1)),
        App.globalPut(KEY_APPROVE_VOTES, Int(0)),
        App.globalPut(KEY_REJECT_VOTES, Int(0)),
        Approve(),
    )

    on_opt_in = Seq(
        App.localPut(Txn.sender(), LKEY_VOTED, Int(0)),
        Approve(),
    )

    register_verifier = Seq(
        Assert(is_creator()),
        Assert(Txn.application_args.length() >= Int(4)),
        App.globalPut(KEY_PACT_APP_ID, Btoi(Txn.application_args[1])),
        App.globalPut(KEY_VERIFIER_ADDRESS, Txn.application_args[2]),
        App.globalPut(KEY_REQUIRED_VOTES, Btoi(Txn.application_args[3])),
        App.globalPut(KEY_APPROVE_VOTES, Int(0)),
        App.globalPut(KEY_REJECT_VOTES, Int(0)),
        Approve(),
    )

    cast_vote = Seq(
        Assert(App.localGet(Txn.sender(), LKEY_VOTED) == Int(0)),
        If(
            Txn.application_args[1] == Bytes("approve"),
            App.globalPut(KEY_APPROVE_VOTES, App.globalGet(KEY_APPROVE_VOTES) + Int(1)),
            App.globalPut(KEY_REJECT_VOTES, App.globalGet(KEY_REJECT_VOTES) + Int(1)),
        ),
        App.localPut(Txn.sender(), LKEY_VOTED, Int(1)),
        Approve(),
    )

    check_threshold = Seq(
        Log(Itob(App.globalGet(KEY_APPROVE_VOTES))),
        Return(App.globalGet(KEY_APPROVE_VOTES) >= App.globalGet(KEY_REQUIRED_VOTES)),
    )

    handle_noop = Seq(
        Assert(Txn.application_args.length() > Int(0)),
        Cond(
            [Txn.application_args[0] == Bytes("register_verifier"), register_verifier],
            [Txn.application_args[0] == Bytes("cast_vote"), cast_vote],
            [Txn.application_args[0] == Bytes("check_threshold"), check_threshold],
        ),
    )

    return Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.OptIn, on_opt_in],
        [Txn.on_completion() == OnComplete.CloseOut, Approve()],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(is_creator())],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(is_creator())],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop],
    )


def clear_program() -> Expr:
    return Int(1)


if __name__ == "__main__":
    os.makedirs("build", exist_ok=True)
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_program(), mode=Mode.Application, version=8)
    with open("build/pact_verification_approval.teal", "w", encoding="utf-8") as f:
        f.write(approval)
    with open("build/pact_verification_clear.teal", "w", encoding="utf-8") as f:
        f.write(clear)
    print("Verification contract compiled successfully")
