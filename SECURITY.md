# Security Policy

## Reporting

Do not post credentials, private addresses, or exploitable details in a public issue. Report suspected security problems privately through the repository owner or the contact method listed on the production site.

## Deployment requirements

- Never commit `.env`, `.env.local`, AWS credentials, API keys, database passwords, or private source snapshots.
- Keep PostgreSQL private and expose only HTTPS through Caddy.
- Use a unique production database password.
- Enable MFA on AWS root and administrative accounts.
- Restrict Google and other provider keys by API, referrer, quota, and budget.
- Review dependency audit results before public deployment.
- Do not enable retained address searches until the privacy page, retention policy, access controls, and deletion process are live.
