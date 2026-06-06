# Secure Downloads and Rights Plan

## Public Site

The public Aura Audio Club site may contain:

- Catalog pages
- Cover art
- Short audio samples
- Original preview scripts that can be read by browser narration
- Marketplace links
- Checkout links
- Sales copy and metadata

The public site must not contain complete audiobook files. If a complete file is
stored under `assets/`, GitHub Pages, Render static hosting or any public CDN,
buyers can bypass payment and download it directly.

## Paid Download Flow

Use one of these delivery paths:

1. Marketplace delivery: Amazon, Audible/ACX, Google Play Books, Kobo, Apple
   Books, Payhip, Gumroad or another digital-product platform hosts the complete
   file and unlocks the buyer download after payment.
2. Private gateway delivery: the included `secure-download-gateway` verifies a
   confirmed payment and creates a signed download URL for the complete audio.

The private gateway expects complete files in:

```text
secure-download-gateway/private-audio/<book-id>/en.m4a
secure-download-gateway/private-audio/<book-id>/es.m4a
```

That folder is ignored by git and must stay private.

## Rights Position

Aura Audio Club production should use:

- Original manuscripts created for this catalog
- Original cover art or commercially licensed cover art
- Narration with commercial usage rights
- Truthful AI disclosure whenever a marketplace asks for it
- No copyrighted books, no copied recipes, no celebrity voices, no famous
  character names and no brand-owned stories

Prosperity, angels and money-mindset titles should be positioned as inspiration,
reflection and practical habits. They must not promise guaranteed income,
investment performance, medical outcomes or supernatural financial results.

## Current Catalog State

- 130 product concepts are cataloged.
- 130 original generated cover images are available for the public site.
- 15 titles have English and Spanish preview audio.
- Complete paid downloads are intentionally not public until the corresponding
  full manuscript, licensed narration, mastering, marketplace approval and
  payment link exist.
- Public preview scripts are original, but the final paid narration must use a
  narrator or TTS engine with clear commercial rights. Do not sell macOS system
  voice recordings as final audiobook audio unless the applicable Apple license
  is reviewed and permits that exact use.

## Gateway Environment Variables

```text
PORT=8091
PUBLIC_SITE_URL=https://your-public-site.example
STRIPE_SECRET_KEY=sk_live_...
DOWNLOAD_SIGNING_SECRET=random-long-secret
ADMIN_TOKEN=random-admin-secret
PRIVATE_AUDIO_DIR=/path/to/private-audio
PRODUCTS_JSON=/path/to/products.json
```

Use `STRIPE_SECRET_KEY` only on the server. Never put it in `index.html`,
`checkout.html`, `catalog.js` or any public JavaScript file.
