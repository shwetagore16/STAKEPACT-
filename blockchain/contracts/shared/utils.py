from pyteal import *


def is_creator() -> Expr:
    return Txn.sender() == Global.creator_address()


def is_valid_payment(receiver: Expr, amount: Expr) -> Expr:
    return And(
        Txn.type_enum() == TxnType.Payment,
        Txn.receiver() == receiver,
        Txn.amount() == amount,
    )


def require_auth(address: Expr) -> Expr:
    return Assert(Txn.sender() == address)
