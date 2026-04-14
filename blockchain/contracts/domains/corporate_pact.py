DOMAIN_KEY = 'corporate'
DOMAIN_TITLE = 'Corporate Pact Contract'
DEFAULT_VERIFIER = 'delivery-manager'


def domain_metadata() -> dict[str, str]:
    return {
        'domain': DOMAIN_KEY,
        'title': DOMAIN_TITLE,
        'default_verifier': DEFAULT_VERIFIER,
        'proof_policy': 'artifact upload + stakeholder sign-off',
    }
