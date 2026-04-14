DOMAIN_KEY = 'personal'
DOMAIN_TITLE = 'Personal Pact Contract'
DEFAULT_VERIFIER = 'peer-circle'


def domain_metadata() -> dict[str, str]:
    return {
        'domain': DOMAIN_KEY,
        'title': DOMAIN_TITLE,
        'default_verifier': DEFAULT_VERIFIER,
        'proof_policy': 'self proof + optional peer challenge',
    }
