# Aura Audio Club

Separate publishing-site concept for original bilingual audiobooks. This folder
does not belong to the API marketplace brand and should not be mixed with
`patoapis`.

## Current State

- Static catalog site with 130 original audiobook concepts
- English and Spanish interface controls
- English and Spanish browser-narration preview controls
- 130 original generated cover images
- Paid-download checkout pages prepared for marketplace or private gateway use
- Secure-download gateway scaffold for payment-confirmed private downloads
- Two priority recipe flagships:
  - `The Thousand Sweet Recipes Treasury`
  - `The Thousand Savory Recipes Treasury`
- Additional spiritual, self-help, prosperity, angel-guidance and money-mindset
  audiobook lines for high-demand marketplace categories
- Marketplace route documented for Amazon KDP, Audible/ACX, Google Play Books,
  Kobo and Apple Books

The catalog is a production pipeline, not a claim that all audiobooks are
finished. Each title still needs final manuscript, narration, mastering,
metadata, rights/disclosure checks and marketplace approval before sale.

Complete audio files must not be uploaded to the public website. The public site
is for samples and checkout links; full downloads belong in a marketplace or the
private gateway documented in `SECURE_DOWNLOADS_AND_RIGHTS.md`.

The current public previews use browser narration from original preview scripts.
Final paid audiobooks still require narration from a voice engine or narrator
with clear commercial rights.

## Open Locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8088
```

from this folder and visit `http://localhost:8088`.

## Recommended Separation

- API business: `patoapis`
- Audiobook business: `Aura Audio Club`
- Separate website, marketplace accounts, analytics, email list and product
  descriptions

This avoids confusing RapidAPI buyers with audiobook customers and keeps each
business easier to market.
