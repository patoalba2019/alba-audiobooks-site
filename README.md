# Alba Audiobooks

Separate publishing-site concept for original bilingual audiobooks. This folder
does not belong to the API marketplace brand and should not be mixed with
`patoapis`.

## Current State

- Static catalog site with 100 original audiobook concepts
- 100 generated cover images
- Two priority recipe flagships:
  - `The Thousand Sweet Recipes Treasury`
  - `The Thousand Savory Recipes Treasury`
- Marketplace route documented for Amazon KDP, Audible/ACX, Google Play Books,
  Kobo and Apple Books

The catalog is a production pipeline, not a claim that all audiobooks are
finished. Each title still needs manuscript, narration, mastering, metadata,
rights/disclosure checks and marketplace approval before sale.

## Open Locally

Open `index.html` in a browser, or run:

```bash
python3 -m http.server 8088
```

from this folder and visit `http://localhost:8088`.

## Recommended Separation

- API business: `patoapis`
- Audiobook business: `Alba Audiobooks`
- Separate website, marketplace accounts, analytics, email list and product
  descriptions

This avoids confusing RapidAPI buyers with audiobook customers and keeps each
business easier to market.
