# Deployment

The production target is GitHub Pages with the custom domain `fmarslan.com`.

The repository uses the `github-pages` gem to keep local builds aligned with the hosted environment. Deployment configuration must preserve `CNAME`, canonical URLs, the sitemap, and the RSS feed.

No production container image or Kubernetes resources are required.
