DOMAIN_KEY = 'government'
DOMAIN_TITLE = 'Government Pact Contract'
DEFAULT_VERIFIER = 'public-officer'


def domain_metadata() -> dict[str, str]:
    return {
        'domain': DOMAIN_KEY,
        'title': DOMAIN_TITLE,
        'default_verifier': DEFAULT_VERIFIER,
        'proof_policy': 'official portal receipt + time-window validation',
    }
