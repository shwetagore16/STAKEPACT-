import os

from pyteal import *


KEY_CREATOR = Bytes("creator")
KEY_STAKE_AMOUNT = Bytes("stake_amount")
KEY_DEADLINE = Bytes("deadline")
KEY_STATUS = Bytes("status")
KEY_MEMBER_COUNT = Bytes("member_count")
KEY_PROOF_COUNT = Bytes("proof_count")
KEY_CATEGORY = Bytes("category")
KEY_VERIFIER = Bytes("verifier")
KEY_VERIFICATION_TYPE = Bytes("verification_type")
KEY_TOTAL_STAKED = Bytes("total_staked")

LKEY_IS_MEMBER = Bytes("is_member")
LKEY_HAS_STAKED = Bytes("has_staked")
LKEY_PROOF_SUBMITTED = Bytes("proof_submitted")
LKEY_VOTE_APPROVE = Bytes("vote_count_approve")
LKEY_VOTE_REJECT = Bytes("vote_count_reject")
LKEY_STAKE_RETURNED = Bytes("stake_returned")

STATUS_ACTIVE = Bytes("active")
STATUS_COMPLETED = Bytes("completed")
STATUS_FAILED = Bytes("failed")
STATUS_DISPUTED = Bytes("disputed")

GRACE_PERIOD_SECONDS = Int(24 * 60 * 60)


@Subroutine(TealType.none)
def pay_to(account: Expr, amount: Expr) -> Expr:
    return Seq(
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: account,
                TxnField.amount: amount,
                TxnField.fee: Int(0),
            }
        ),
        InnerTxnBuilder.Submit(),
    )


def approval_program() -> Expr:
    is_creator = Txn.sender() == Global.creator_address()

    on_create = Seq(
        App.globalPut(KEY_CREATOR, Global.creator_address()),
        App.globalPut(KEY_STAKE_AMOUNT, Int(0)),
        App.globalPut(KEY_DEADLINE, Int(0)),
        App.globalPut(KEY_STATUS, STATUS_ACTIVE),
        App.globalPut(KEY_MEMBER_COUNT, Int(0)),
        App.globalPut(KEY_PROOF_COUNT, Int(0)),
        App.globalPut(KEY_CATEGORY, Bytes("education")),
        App.globalPut(KEY_VERIFIER, Global.zero_address()),
        App.globalPut(KEY_VERIFICATION_TYPE, Bytes("group_vote")),
        App.globalPut(KEY_TOTAL_STAKED, Int(0)),
        Approve(),
    )

    on_opt_in = Seq(
        App.localPut(Txn.sender(), LKEY_IS_MEMBER, Int(0)),
        App.localPut(Txn.sender(), LKEY_HAS_STAKED, Int(0)),
        App.localPut(Txn.sender(), LKEY_PROOF_SUBMITTED, Int(0)),
        App.localPut(Txn.sender(), LKEY_VOTE_APPROVE, Int(0)),
        App.localPut(Txn.sender(), LKEY_VOTE_REJECT, Int(0)),
        App.localPut(Txn.sender(), LKEY_STAKE_RETURNED, Int(0)),
        Approve(),
    )

    create_pact = Seq(
        Assert(is_creator),
        Assert(Txn.application_args.length() >= Int(5)),
        App.globalPut(KEY_CREATOR, Txn.sender()),
        App.globalPut(KEY_STAKE_AMOUNT, Btoi(Txn.application_args[1])),
        App.globalPut(KEY_DEADLINE, Btoi(Txn.application_args[2])),
        App.globalPut(KEY_CATEGORY, Txn.application_args[3]),
        App.globalPut(KEY_VERIFICATION_TYPE, Txn.application_args[4]),
        App.globalPut(
            KEY_VERIFIER,
            If(
                Txn.application_args.length() > Int(5),
                Txn.application_args[5],
                Global.zero_address(),
            ),
        ),
        App.globalPut(KEY_STATUS, STATUS_ACTIVE),
        App.globalPut(KEY_MEMBER_COUNT, Int(0)),
        App.globalPut(KEY_PROOF_COUNT, Int(0)),
        App.globalPut(KEY_TOTAL_STAKED, Int(0)),
        Approve(),
    )

    join_pact = Seq(
        Assert(App.globalGet(KEY_STATUS) == STATUS_ACTIVE),
        Assert(Global.latest_timestamp() <= App.globalGet(KEY_DEADLINE)),
        Assert(App.localGet(Txn.sender(), LKEY_IS_MEMBER) == Int(0)),
        Assert(Txn.group_index() > Int(0)),
        Assert(Gtxn[Txn.group_index() - Int(1)].type_enum() == TxnType.Payment),
        Assert(Gtxn[Txn.group_index() - Int(1)].sender() == Txn.sender()),
        Assert(
            Gtxn[Txn.group_index() - Int(1)].receiver()
            == Global.current_application_address()
        ),
        Assert(
            Gtxn[Txn.group_index() - Int(1)].amount()
            == App.globalGet(KEY_STAKE_AMOUNT)
        ),
        App.localPut(Txn.sender(), LKEY_IS_MEMBER, Int(1)),
        App.localPut(Txn.sender(), LKEY_HAS_STAKED, Int(1)),
        App.localPut(Txn.sender(), LKEY_PROOF_SUBMITTED, Int(0)),
        App.localPut(Txn.sender(), LKEY_VOTE_APPROVE, Int(0)),
        App.localPut(Txn.sender(), LKEY_VOTE_REJECT, Int(0)),
        App.localPut(Txn.sender(), LKEY_STAKE_RETURNED, Int(0)),
        App.globalPut(KEY_MEMBER_COUNT, App.globalGet(KEY_MEMBER_COUNT) + Int(1)),
        App.globalPut(KEY_TOTAL_STAKED, App.globalGet(KEY_TOTAL_STAKED) + App.globalGet(KEY_STAKE_AMOUNT)),
        Approve(),
    )

    submit_proof = Seq(
        Assert(App.localGet(Txn.sender(), LKEY_IS_MEMBER) == Int(1)),
        Assert(
            Global.latest_timestamp()
            <= App.globalGet(KEY_DEADLINE) + GRACE_PERIOD_SECONDS
        ),
        Assert(App.localGet(Txn.sender(), LKEY_PROOF_SUBMITTED) == Int(0)),
        App.localPut(Txn.sender(), LKEY_PROOF_SUBMITTED, Int(1)),
        App.globalPut(KEY_PROOF_COUNT, App.globalGet(KEY_PROOF_COUNT) + Int(1)),
        Approve(),
    )

    vote_proof = Seq(
        Assert(App.localGet(Txn.sender(), LKEY_IS_MEMBER) == Int(1)),
        Assert(App.localGet(Txn.sender(), LKEY_VOTE_APPROVE) == Int(0)),
        Assert(App.localGet(Txn.sender(), LKEY_VOTE_REJECT) == Int(0)),
        Assert(Txn.application_args.length() >= Int(2)),
        Assert(Txn.accounts.length() > Int(1)),
        Assert(App.localGet(Txn.accounts[1], LKEY_IS_MEMBER) == Int(1)),
        If(
            Txn.application_args[1] == Bytes("approve"),
            Seq(
                App.localPut(
                    Txn.accounts[1],
                    LKEY_VOTE_APPROVE,
                    App.localGet(Txn.accounts[1], LKEY_VOTE_APPROVE) + Int(1),
                ),
                App.localPut(Txn.sender(), LKEY_VOTE_APPROVE, Int(1)),
            ),
            Seq(
                App.localPut(
                    Txn.accounts[1],
                    LKEY_VOTE_REJECT,
                    App.localGet(Txn.accounts[1], LKEY_VOTE_REJECT) + Int(1),
                ),
                App.localPut(Txn.sender(), LKEY_VOTE_REJECT, Int(1)),
            ),
        ),
        If(
            App.localGet(Txn.accounts[1], LKEY_VOTE_APPROVE) * Int(2)
            > App.globalGet(KEY_MEMBER_COUNT),
            Seq(
                If(
                    App.localGet(Txn.accounts[1], LKEY_PROOF_SUBMITTED) == Int(0),
                    Seq(
                        App.localPut(Txn.accounts[1], LKEY_PROOF_SUBMITTED, Int(1)),
                        App.globalPut(KEY_PROOF_COUNT, App.globalGet(KEY_PROOF_COUNT) + Int(1)),
                    ),
                ),
                If(
                    App.localGet(Txn.accounts[1], LKEY_STAKE_RETURNED) == Int(0),
                    Seq(
                        pay_to(Txn.accounts[1], App.globalGet(KEY_STAKE_AMOUNT)),
                        App.localPut(Txn.accounts[1], LKEY_STAKE_RETURNED, Int(1)),
                    ),
                ),
            ),
        ),
        Approve(),
    )

    verifier_signoff = Seq(
        Assert(Txn.accounts.length() > Int(1)),
        Assert(Txn.sender() == App.globalGet(KEY_VERIFIER)),
        Assert(App.localGet(Txn.accounts[1], LKEY_IS_MEMBER) == Int(1)),
        If(
            App.localGet(Txn.accounts[1], LKEY_PROOF_SUBMITTED) == Int(0),
            Seq(
                App.localPut(Txn.accounts[1], LKEY_PROOF_SUBMITTED, Int(1)),
                App.globalPut(KEY_PROOF_COUNT, App.globalGet(KEY_PROOF_COUNT) + Int(1)),
            ),
        ),
        If(
            App.localGet(Txn.accounts[1], LKEY_STAKE_RETURNED) == Int(0),
            Seq(
                pay_to(Txn.accounts[1], App.globalGet(KEY_STAKE_AMOUNT)),
                App.localPut(Txn.accounts[1], LKEY_STAKE_RETURNED, Int(1)),
            ),
        ),
        App.globalPut(KEY_STATUS, STATUS_COMPLETED),
        Approve(),
    )

    release_stake = Seq(
        Assert(App.globalGet(KEY_STATUS) != STATUS_DISPUTED),
        Assert(App.localGet(Txn.sender(), LKEY_IS_MEMBER) == Int(1)),
        Assert(App.localGet(Txn.sender(), LKEY_PROOF_SUBMITTED) == Int(1)),
        Assert(App.localGet(Txn.sender(), LKEY_STAKE_RETURNED) == Int(0)),
        pay_to(Txn.sender(), App.globalGet(KEY_STAKE_AMOUNT)),
        App.localPut(Txn.sender(), LKEY_STAKE_RETURNED, Int(1)),
        Approve(),
    )

    completed_members = ScratchVar(TealType.uint64)
    failed_members = ScratchVar(TealType.uint64)
    payout_amount = ScratchVar(TealType.uint64)

    claim_forfeit = Seq(
        Assert(Global.latest_timestamp() > App.globalGet(KEY_DEADLINE)),
        Assert(App.globalGet(KEY_STATUS) != STATUS_DISPUTED),
        Assert(App.localGet(Txn.sender(), LKEY_IS_MEMBER) == Int(1)),
        Assert(App.localGet(Txn.sender(), LKEY_PROOF_SUBMITTED) == Int(1)),
        Assert(App.localGet(Txn.sender(), LKEY_STAKE_RETURNED) == Int(0)),
        completed_members.store(App.globalGet(KEY_PROOF_COUNT)),
        Assert(completed_members.load() > Int(0)),
        failed_members.store(App.globalGet(KEY_MEMBER_COUNT) - completed_members.load()),
        payout_amount.store(App.globalGet(KEY_STAKE_AMOUNT)),
        If(
            failed_members.load() > Int(0),
            payout_amount.store(
                payout_amount.load()
                + (
                    failed_members.load() * App.globalGet(KEY_STAKE_AMOUNT)
                )
                / completed_members.load()
            ),
        ),
        pay_to(Txn.sender(), payout_amount.load()),
        App.localPut(Txn.sender(), LKEY_STAKE_RETURNED, Int(1)),
        App.globalPut(KEY_STATUS, STATUS_FAILED),
        Approve(),
    )

    dispute = Seq(
        Assert(App.localGet(Txn.sender(), LKEY_IS_MEMBER) == Int(1)),
        App.globalPut(KEY_STATUS, STATUS_DISPUTED),
        Approve(),
    )

    handle_noop = Seq(
        Assert(Txn.application_args.length() > Int(0)),
        Cond(
            [Txn.application_args[0] == Bytes("create_pact"), create_pact],
            [Txn.application_args[0] == Bytes("join_pact"), join_pact],
            [Txn.application_args[0] == Bytes("submit_proof"), submit_proof],
            [Txn.application_args[0] == Bytes("vote_proof"), vote_proof],
            [Txn.application_args[0] == Bytes("verifier_signoff"), verifier_signoff],
            [Txn.application_args[0] == Bytes("release_stake"), release_stake],
            [Txn.application_args[0] == Bytes("claim_forfeit"), claim_forfeit],
            [Txn.application_args[0] == Bytes("dispute"), dispute],
        ),
    )

    return Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.OptIn, on_opt_in],
        [Txn.on_completion() == OnComplete.CloseOut, Approve()],
        [Txn.on_completion() == OnComplete.UpdateApplication, Return(is_creator)],
        [Txn.on_completion() == OnComplete.DeleteApplication, Return(is_creator)],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop],
    )


def clear_program() -> Expr:
    return Int(1)


if __name__ == "__main__":
    os.makedirs("build", exist_ok=True)
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_program(), mode=Mode.Application, version=8)
    with open("build/pact_escrow_approval.teal", "w", encoding="utf-8") as f:
        f.write(approval)
    with open("build/pact_escrow_clear.teal", "w", encoding="utf-8") as f:
        f.write(clear)
    print("Compiled successfully")
