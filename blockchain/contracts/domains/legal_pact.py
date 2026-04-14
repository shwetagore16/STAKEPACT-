DOMAIN_KEY = 'legal'
DOMAIN_TITLE = 'Legal Pact Contract'
DEFAULT_VERIFIER = 'legal-counsel'


def domain_metadata() -> dict[str, str]:
    return {
        'domain': DOMAIN_KEY,
        'title': DOMAIN_TITLE,
        'default_verifier': DEFAULT_VERIFIER,
        'proof_policy': 'document hash + verifier attestation',
    }
