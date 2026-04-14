from __future__ import annotations

from pyteal import (
    App,
    Approve,
    Bytes,
    Cond,
    Global,
    If,
    Int,
    Mode,
    OnComplete,
    Reject,
    Return,
    Seq,
    Txn,
    compileTeal,
)


def approval_program():
    is_creator = Txn.sender() == Global.creator_address()

    return Cond(
        [Txn.application_id() == Int(0), Approve()],
        [
            Txn.on_completion() == OnComplete.UpdateApplication,
            Return(is_creator),
        ],
        [
            Txn.on_completion() == OnComplete.DeleteApplication,
            Return(is_creator),
        ],
        [Txn.on_completion() == OnComplete.CloseOut, Approve()],
        [Txn.on_completion() == OnComplete.OptIn, Approve()],
        [
            Txn.application_args[0] == Bytes('fund'),
            Seq(
                App.globalPut(Bytes('last_funder'), Txn.sender()),
                App.globalPut(Bytes('last_amount'), Txn.application_args[1]),
                Approve(),
            ),
        ],
        [
            Txn.application_args[0] == Bytes('release'),
            If(is_creator, Approve(), Reject()),
        ],
    )


def clear_state_program():
    return Approve()


if __name__ == '__main__':
    print(compileTeal(approval_program(), mode=Mode.Application, version=8))
    print(compileTeal(clear_state_program(), mode=Mode.Application, version=8))
