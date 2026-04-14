from contracts.domains.corporate_pact import domain_metadata as corporate_meta
from contracts.domains.education_pact import domain_metadata as education_meta
from contracts.domains.government_pact import domain_metadata as government_meta
from contracts.domains.legal_pact import domain_metadata as legal_meta
from contracts.domains.personal_pact import domain_metadata as personal_meta


def test_domain_contract_metadata_keys() -> None:
    metadata_sets = [
        education_meta(),
        corporate_meta(),
        legal_meta(),
        government_meta(),
        personal_meta(),
    ]

    for metadata in metadata_sets:
        assert {'domain', 'title', 'default_verifier', 'proof_policy'}.issubset(metadata.keys())


def test_domains_are_unique() -> None:
    domains = {
        education_meta()['domain'],
        corporate_meta()['domain'],
        legal_meta()['domain'],
        government_meta()['domain'],
        personal_meta()['domain'],
    }

    assert len(domains) == 5
