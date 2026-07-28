# Environment

The site requires no application secrets or runtime environment variables.

Local development exposes Jekyll only on `127.0.0.1:4000`. Dependencies are persisted in the `bundle-cache` Docker volume, and Codex data is persisted in `codex-home`. Host credential folders are not mounted.

If `/home/dev/.codex` is not writable, remove and recreate only the `codex-home` volume after confirming it contains no required local state.
