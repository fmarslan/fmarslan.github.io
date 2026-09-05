# Development

The project uses Jekyll 3.10 through the GitHub Pages gem and Ruby 3.3 in a Docker Compose based Dev Container.

## Start

1. Open the repository in VS Code or Codex with the Dev Container configuration.
2. Wait for `bundle install` to complete.
3. Run the `run` task or:

   ```bash
   bundle exec jekyll serve --host 0.0.0.0 --port 4000 --watch --force_polling --incremental --livereload
   ```

4. Open <http://localhost:4000>.

The container runs as `dev` with UID/GID `1000:1000`, the deterministic default for Windows Docker Desktop. Gems and Codex data are stored in Docker named volumes. The Jekyll repository follows GitHub Pages conventions, so source and Gem manifests remain at the repository root instead of the generic `src/` bootstrap layout.

## Commands

```bash
bundle exec jekyll build
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --watch --force_polling --incremental --livereload
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --watch --force_polling --incremental --trace
```

## URL and language rules

- Existing post filenames, dates, permalinks, and canonical URLs must remain unchanged.
- Turkish is the default language.
- English pages live below `/en/`.
- Language switching is explicit; `alternate_url` and post `translation_key` connect real translations and generate reciprocal hreflang links.
- A post without a real translation must not redirect to an unrelated English page.

## SEO verification

Run `bundle exec jekyll build`, then `bundle exec ruby scripts/audit_seo.rb` (or prefix each command with `docker compose exec site`). The audit checks generated HTML metadata, JSON-LD, local social images/icons, sitemap targets, canonical URLs and reciprocal language links. It exits nonzero on errors.

Use a plain URL such as `http://localhost:4000/` in preview inspectors, not Markdown link syntax. Production preview tools cannot inspect localhost. Local validation does not prove that a deployed site or a platform's cached preview has updated.

Every indexable page should have a descriptive title and language-appropriate description. Use `social_image` to override a sharing image independently of the page hero. Use `image_alt` for its description. Real translations need `alternate_url` (pages) or matching `translation_key` (posts). Non-indexable utility pages need both `robots: noindex, follow` and `sitemap: false`.

The shared base layout owns SEO tags; do not add a second SEO include. JSON-LD distinguishes Person, WebSite, WebPage and Article; article modification dates use actual front matter, not the build time.
