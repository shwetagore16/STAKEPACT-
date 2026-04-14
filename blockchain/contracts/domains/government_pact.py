import os

from pyteal import *

from contracts.core.pact_escrow import (
    approval_program as core_approval_program,
    clear_program as core_clear_program,
)


KEY_AUTHORITY_NAME = Bytes("authority_name")
KEY_LEGAL_SECTION = Bytes("legal_section")
KEY_WATCHDOG_ADDRESS = Bytes("watchdog_address")
KEY_IS_PUBLIC = Bytes("is_public")


@Subroutine(TealType.none)
def pay_watchdog(amount: Expr) -> Expr:
    return Seq(
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: App.globalGet(KEY_WATCHDOG_ADDRESS),
                TxnField.amount: amount,
                TxnField.fee: Int(0),
            }
        ),
        InnerTxnBuilder.Submit(),
    )


def approval_program() -> Expr:
    set_government_meta = Seq(
        Assert(Txn.application_args.length() >= Int(5)),
        Assert(Txn.sender() == App.globalGet(Bytes("creator"))),
        App.globalPut(KEY_AUTHORITY_NAME, Txn.application_args[1]),
        App.globalPut(KEY_LEGAL_SECTION, Txn.application_args[2]),
        App.globalPut(KEY_WATCHDOG_ADDRESS, Txn.application_args[3]),
        App.globalPut(KEY_IS_PUBLIC, Btoi(Txn.application_args[4])),
        Approve(),
    )

    public_audit = Seq(
        Log(App.globalGet(KEY_AUTHORITY_NAME)),
        Log(App.globalGet(KEY_LEGAL_SECTION)),
        Log(App.globalGet(Bytes("status"))),
        Approve(),
    )

    available_funds = ScratchVar(TealType.uint64)

    forfeit_to_watchdog = Seq(
        Assert(Global.latest_timestamp() > App.globalGet(Bytes("deadline"))),
        Assert(App.globalGet(Bytes("status")) != Bytes("disputed")),
        available_funds.store(
            Balance(Global.current_application_address())
            - MinBalance(Global.current_application_address())
        ),
        If(
            available_funds.load() > Int(0),
            pay_watchdog(available_funds.load()),
        ),
        App.globalPut(Bytes("status"), Bytes("failed")),
        Approve(),
    )

    return Cond(
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("set_government_meta"),
            ),
            set_government_meta,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("public_audit"),
            ),
            public_audit,
        ],
        [
            And(
                Txn.application_args.length() > Int(0),
                Txn.application_args[0] == Bytes("forfeit_to_watchdog"),
            ),
            forfeit_to_watchdog,
        ],
        [Int(1), core_approval_program()],
    )


def clear_program() -> Expr:
    return core_clear_program()


if __name__ == "__main__":
    os.makedirs("build", exist_ok=True)
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_program(), mode=Mode.Application, version=8)
    with open("build/government_pact_approval.teal", "w", encoding="utf-8") as f:
        f.write(approval)
    with open("build/government_pact_clear.teal", "w", encoding="utf-8") as f:
        f.write(clear)
    print("Government contract compiled")
