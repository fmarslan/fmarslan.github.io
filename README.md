# fmarslan.com

Personal Jekyll site for technical writing, professional information, and a bilingual Turkish/English web presence.

## Local development

Open the repository in a Dev Container, then run:

```bash
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --watch --force_polling --incremental --livereload
```

The site is available at <http://localhost:4000>. Turkish is the default language. English browser preferences are redirected only when an English counterpart exists.

### Docker

Start the local site with:

```bash
docker compose up --build
```

Then open <http://localhost:4000>.

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for setup and validation details.
