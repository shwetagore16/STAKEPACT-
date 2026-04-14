DOMAIN_KEY = 'education'
DOMAIN_TITLE = 'Education Pact Contract'
DEFAULT_VERIFIER = 'cohort-admin'


def domain_metadata() -> dict[str, str]:
    return {
        'domain': DOMAIN_KEY,
        'title': DOMAIN_TITLE,
        'default_verifier': DEFAULT_VERIFIER,
        'proof_policy': 'submission + cohort confirmation',
    }
