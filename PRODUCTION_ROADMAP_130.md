# 130 Audiobook Production Roadmap

## Objective

Publish a separate paid audiobook catalog under Aura Audio Club without mixing it
with the API business. The public site can attract buyers, but each paid product
must be finished before it is sold as a complete audiobook.

## Production Rules

1. Write original manuscript.
2. Prepare English and Spanish editions separately.
3. Use commercial-rights narration only.
4. Master audio for marketplace quality.
5. Keep complete audio private until payment delivery is active.
6. Add marketplace URL to `catalog.js` only after the listing is accepted.
7. Preserve truthful AI and narration disclosures required by each marketplace.

## Priority Batch

1. `aab-119` - Messages from the Angels of Prosperity
2. `aab-130` - The Calm Wealth Plan
3. `aab-128` - Money Magnet Mindset
4. `aab-001` - The Thousand Sweet Recipes Treasury
5. `aab-002` - The Thousand Savory Recipes Treasury
6. `aab-101` - The Quiet Light Within
7. `aab-120` - Angel Numbers and New Beginnings
8. `aab-125` - The Prosperity Prayer Journal
9. `aab-126` - Small Money Rituals for Calm Mornings
10. `aab-122` - Your Guardian Angel Companion

## Suggested Launch Prices

- Standard audiobook: USD 2.99
- Large recipe flagship plus companion index: USD 4.99

These are launch prices designed to be cheap enough to attract first buyers.
They can be raised after reviews, sales history and full catalog depth improve.

## Voice Strategy

Do not sell macOS system voice recordings as final audiobook products unless the
applicable Apple license is reviewed and explicitly permits that use.

Preferred paths:

- Human narrator with written commercial release.
- Commercial TTS provider that explicitly allows audiobook resale.
- Open-source TTS model with a reviewed model card/license, saved attribution
  and stable local generation workflow.

Kokoro is promising because the model card lists Apache 2.0, but local setup on
this machine was too heavy to use reliably during this pass. Piper is another
candidate, but each voice model card must be checked because some voice datasets
may have restrictions.

## Marketplace Sequence

1. Finish `aab-119` English and Spanish manuscripts.
2. Generate or record final licensed narration.
3. Master and split by chapter.
4. Upload to marketplace.
5. Add marketplace URL to `catalog.js`.
6. Confirm checkout button leads to payment.
7. Confirm buyer receives download or marketplace access after payment.
8. Repeat the same workflow for the next title.
