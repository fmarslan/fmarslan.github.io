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
- Browser-language redirect runs only on pages with an explicit `alternate_url`.
- A post without a real translation must not redirect to an unrelated English page.
