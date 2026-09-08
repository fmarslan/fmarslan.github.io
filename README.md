# fmarslan.com

Personal Jekyll site for technical writing, professional information, and a bilingual Turkish/English web presence.

## Local development

Open the repository in a Dev Container, then run:

```bash
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --watch --force_polling --incremental --livereload
```

The site is available at <http://localhost:4000>. English is the default at `/`; Turkish home is `/tr/`. Article URLs remain unchanged. Language changes are explicit. On English pages, Turkish browser preferences receive a dismissible suggestion once per tab session; no automatic language navigation occurs.

### Docker

Start the local site with:

```bash
docker compose up --build
```

Then open <http://localhost:4000>.

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup and validation details.


## Publishing and SEO

Keep the existing GitHub Pages **Deploy from a branch → main → / (root)** publishing
source, custom domain `fmarslan.com`, and Enforce HTTPS. No custom Actions workflow or
Jekyll plugin is required. Standard Liquid templates enhance generated HTML while
historical article source text stays unchanged.

Run `bundle exec jekyll build`, `bundle exec ruby scripts/audit_seo.rb _site`, and
`node --test tests/language-suggestion.test.cjs` before publishing. The audit checks
language pairs, redirects, broken internal resources, headings and image dimensions.

Original images are retained. Run `python scripts/optimize_images.py` with Pillow after
adding or replacing images, then commit `_data/image_assets.json` and `assets/optimized/`.
SEO-only descriptions and titles are in `_data/seo_overrides.json`; they do not change
article headings or body text. Do not update article dates for technical rebuilds.

`sessionStorage` scopes the suggestion to a tab session, surviving navigation and reloads.
A fresh tab session can show it again; browser session restoration may retain it. If
session storage is unavailable the suggestion stays hidden rather than repeating.

Analytics receives `contact_email_click` and `cv_download_click` without addresses,
query strings or page text. Mark the desired events as key events in GA4 after publication
and verify them with a real interaction. Link Search Console in GA4 separately; source
changes alone do not configure account integrations or force Google to index pages.
