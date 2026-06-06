# Aura Secure Download Gateway

This lightweight Node server protects complete audiobook downloads.

It does three jobs:

1. Creates a paid checkout session.
2. Verifies that payment is confirmed.
3. Generates a signed, time-limited download token for the paid buyer.

Complete audiobook files belong in private server storage, not in the public
website repository.

## Local Start

```bash
PORT=8091 \
PUBLIC_SITE_URL=http://localhost:8088 \
DOWNLOAD_SIGNING_SECRET=replace-this-secret \
node server.js
```

Health check:

```bash
curl http://localhost:8091/health
```

## Private Audio Layout

```text
private-audio/aab-119/en.m4a
private-audio/aab-119/es.m4a
```

## Manual Token

For a marketplace sale that does not call Stripe directly, create a token only
after payment is confirmed:

```bash
curl -X POST http://localhost:8091/manual-token \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"aab-119","lang":"en","email":"buyer@example.com"}'
```

The buyer download URL is:

```text
https://your-gateway.example/download/aab-119?token=<download_token>
```

## Production Warning

Never deploy with the default `DOWNLOAD_SIGNING_SECRET`. Never commit
`STRIPE_SECRET_KEY`, `ADMIN_TOKEN`, complete audio files or buyer data.
