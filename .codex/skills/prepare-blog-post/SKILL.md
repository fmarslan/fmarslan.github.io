---
name: prepare-blog-post
description: Prepare and enrich bilingual fmarslan.com Jekyll articles for publication. Use when the user says an article is mature, asks to make a post publication-ready, says "makaleyi yayına hazırla", requests final editorial polish, or wants the full article package including Turkish/English routing, a simple cover, introduction, metadata, SEO/social preview, tags, diagrams, code examples, and release checks.
---

# Prepare Blog Post

Turn a mature draft into a complete fmarslan.com post. Work autonomously inside this repository and preserve the author's argument and voice.

## Editorial objective

Write each post to demonstrate the author's expertise and give curious readers a useful new way to see the problem, not to provide an exhaustive tutorial or implementation manual.

- Show expertise through accurate distinctions, real constraints, trade-offs, hidden consequences, and questions that practitioners know to ask.
- Explain enough for the argument to be credible and useful, but do not expand every adjacent topic, edge case, or implementation detail merely for completeness.
- Leave readers with a clearer mental model and productive directions for further research. It is acceptable for implementation depth to remain outside the article when it is not necessary for the central claim.
- Keep technical statements correct and qualify assumptions that would otherwise mislead. A deliberate scope boundary is acceptable; a false or overconfident simplification is not.
- Do not turn the post into a sales pitch or add a consulting call to action unless the user asks. Let the quality of the framing and analysis establish authority naturally.

## Workflow

### 1. Inspect the repository and article

- Read `_config.yml`, `_layouts/base.html`, `_layouts/post.html`, and two recent posts before editing.
- Resolve the target post under `_posts/`.
- Preserve unrelated worktree changes.
- Confirm the article language from its content. Use clear B2-C1 English for English posts and natural, direct Turkish for Turkish posts.
- Treat “prepare for publication” as content preparation, not permission to commit, push, or deploy.

### 2. Create the bilingual article pair and route it explicitly

For every new article, create or maintain both language versions unless the user explicitly requests a single-language draft.

- Put Turkish posts only under `_posts/tr/`.
- Put English posts only under `_posts/en/`.
- Never create post files directly under `_posts/`.
- Use the same date and the same stable, unique `translation_key` in both versions.
- Write the English version in natural B2-C1 English. Preserve the author's argument and voice; do not produce a literal sentence-by-sentence translation.
- Use a Turkish slug for the Turkish filename and permalink, and a natural English slug for the English filename and permalink.
- Give every post an explicit `permalink`; never rely on folder-derived categories for URL generation.

Use this structure for new posts:

```text
_posts/tr/YYYY-MM-DD-turkish-slug.md
_posts/en/YYYY-MM-DD-english-slug.md
```

Use these canonical URLs:

```text
/tr/YYYY/MM/DD/turkish-slug.html
/en/YYYY/MM/DD/english-slug.html
```

URL preservation rules:

- Do not normalize or change a published legacy post's existing permalink. Old Turkish posts may intentionally omit `/tr/`.
- Before moving or renaming an existing post, record its rendered URL and add that exact value as an explicit `permalink`.
- Change a published canonical URL only when the user explicitly requests it. Preserve every old URL with `redirect_from` and confirm `jekyll-redirect-from` is enabled.
- Keep redirect URLs out of sitemap and search results; only the canonical permalink should appear there.
- In `{% post_url %}` references, include the language folder, for example `{% post_url tr/2026-08-01-example %}` or `{% post_url en/2026-08-01-example %}`.
- Confirm `hreflang="tr"`, `hreflang="en"`, and `hreflang="x-default"` resolve through the shared `translation_key`; `x-default` must point to Turkish.

### 3. Mature the content

- Identify the central claim and make every section support it.
- Decide what level of detail proves the central claim, and stop before the post becomes an encyclopedic reference or step-by-step implementation guide without a user request for that depth.
- Remove repeated arguments, editorial notes, unsupported certainty, and unnecessary background.
- Separate sourced facts from the author's inference.
- Check cited sources directly when a claim depends on them.
- Use concrete examples and plain technical language. Let sentence and paragraph length follow the thought being expressed: mix short, medium, and long constructions as a real author naturally would, without optimizing for uniformly short paragraphs or imposing a mechanical rhythm.
- Preserve important trade-offs; do not turn a problem-analysis article into a sales pitch for one solution.
- Define nonstandard terms as local wording. Prefer established terminology when a reliable source provides one.

#### Keep the editorial rhythm natural

- Never use the em dash character (Unicode U+2014) in article content, titles, descriptions, or metadata. Rewrite the sentence with commas, semicolons, parentheses, colons, or separate sentences as appropriate.
- Use transition formulas such as “Asıl problem şu”, “Bu noktada”, “Kritik gerçek”, “Kural basit”, “En net çıkarım”, and “Son olarak” sparingly. Do not repeat the same formula across sections or introduce a claim with one when the preceding context already makes it clear.
- Avoid sequences of short, emphatic sentences written only to create drama. Combine related thoughts into complete paragraphs unless a short sentence carries necessary contrast or technical emphasis.
- Do not normalize paragraphs to a uniform size. Allow a developed argument to remain a substantial paragraph, use a short paragraph only when the idea genuinely benefits from isolation, and vary syntax rather than repeating the same sentence shape.
- Do not end every section with a slogan, maxim, bold declaration, or artificially definitive conclusion. Let evidence, examples, uncertainty, or a transition carry the reader forward when appropriate.
- Prefer specific observations, mechanisms, constraints, and consequences over generic declarations such as “the real issue is…”, “everything changes here”, or “this is critical”.
- Preserve the author’s genuinely concise or emphatic lines when they are distinctive and earned by the argument; reduce patterns, not personality.
- During the final edit, scan headings, paragraph openings, blockquotes, bold lines, and section endings for repeated rhetorical templates. Rewrite enough instances to prevent an AI-polished or LinkedIn-style cadence.

### 4. Enrich technical explanation

Use only visuals that improve understanding:

- Use Mermaid for architecture, flow, sequence, or dependency diagrams.
- Use Markdown tables for mappings, option comparisons, role matrices, and repeated field relationships.
- Use concise code blocks for the main alternatives discussed in the article.
- Keep all diagrams, tables, and code examples consistent with the same running example.
- Verify Mermaid fences and syntax against the repository's existing Mermaid support.
- Do not add decorative diagrams or duplicate prose in visual form.

### 5. Write the opening

The Markdown body must begin in this order:

1. A one- or two-sentence introduction that states the problem and gives the reader a reason to continue.
2. The article body.

Do not insert the cover image into the Markdown body. `_layouts/post.html` renders `page.image` once between the description and article body. Do not repeat the front-matter description word for word in the introduction.

### 6. Create the cover

Generate one new landscape cover unless a suitable final cover already exists.

Cover rules:

- Use a 3:2 landscape composition, normally 1536x1024.
- Use exactly two or three colors, including the background.
- Prefer flat geometric, modernist, editorial, or screen-print-inspired composition.
- Express one idea from the article with a small number of shapes.
- Use generous negative space and restrained texture.
- Include no title, text, letters, numbers, logos, watermark, people, robots, brains, cloud icons, circuit boards, neon, gradients, glow, or 3D effects.
- Avoid generic AI-generated aesthetics and excessive detail.
- Save the final image under `assets/img/` with an English kebab-case filename.
- Reference the image only through the front-matter `image` field. Do not add a Markdown or HTML image reference for the cover inside the article body.
- Inspect the generated image before accepting it. Regenerate once when it violates the palette, simplicity, or no-text rules.

Use the available image-generation skill/tool for raster cover creation and follow its save/validation workflow.

### 7. Complete front matter

Use this shape:

```yaml
---
layout: post
title: "Specific article title"
date: YYYY-MM-DD
description: "One or two short sentences written for search and link previews."
image: /assets/img/descriptive-cover-name.png
tags: [three, to, six, focused-tags]
lang: en-US
translation_key: "stable-shared-key"
permalink: /en/YYYY/MM/DD/english-slug.html
published: false
---
```

Rules:

- Keep `description` specific, useful, and normally 120-180 characters.
- Make the description summarize the article's decision or trade-off, not the author biography.
- Use `lang: en-US` for English and `lang: tr-TR` for Turkish.
- Use `/en/YYYY/MM/DD/english-slug.html` for new English posts.
- Use `/tr/YYYY/MM/DD/turkish-slug.html` for new Turkish posts.
- Give both versions the same `translation_key`; never change it after publication.
- Use three to six lowercase, focused tags.
- Ensure the filename date and front-matter date match.
- Use a natural kebab-case slug in the post's own language; keep Turkish and English slugs distinct.
- Keep `published: false` while preparing a draft. Remove it or set it to `true` only when the user explicitly asks to publish.
- Keep the cover only in `image`; the post layout renders it and the base layout uses it for social previews.
- Use `redirect_from` only to preserve an already published URL when its canonical permalink must change.

### 8. Verify SEO and social preview metadata

Confirm `_layouts/base.html` produces per-article metadata:

```html
<meta name="description" content="{{ page_description | escape }}">
<meta property="og:title" content="{{ page_title | escape }}">
<meta property="og:description" content="{{ page_description | escape }}">
<meta property="og:image" content="{{ share_image }}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ page_title | escape }}">
<meta name="twitter:description" content="{{ page_description | escape }}">
<meta name="twitter:image" content="{{ share_image }}">
```

- Ensure post metadata prefers `page.description`; use an excerpt only when description is missing.
- Ensure Open Graph and Twitter titles use the article title, not the author name.
- Ensure the share image becomes an absolute URL in rendered output.
- Preserve author metadata separately through `meta name="author"` and Article JSON-LD.
- Confirm each language version has a self-referencing canonical URL and reciprocal `hreflang` links.
- Confirm Turkish is the `x-default` version.
- If the layout is wrong, fix it once at the shared template instead of adding page-specific HTML.

### 9. Final quality checks

Verify all of the following:

- Front matter is valid and complete.
- The Turkish file is under `_posts/tr/`; the English file is under `_posts/en/`; no post is created directly under `_posts/`.
- Both language versions share one `translation_key` and use explicit `/tr/` and `/en/` permalinks for new publications.
- Filename, date, language, title, and slug agree.
- The introduction begins the Markdown body; the cover is not duplicated inside the body.
- The metadata cover exists, renders once through the post layout, has useful fallback alt text, and follows the two-or-three-color rule.
- Headings form a clear hierarchy and do not duplicate the layout's H1.
- Tables render and contain aligned columns.
- Code fences are balanced.
- Mermaid blocks are balanced and supported by the site.
- Links are valid and tracking parameters are removed.
- Language switching, canonical, reciprocal hreflang, and `x-default` URLs are correct.
- Sitemap, feed, and search index contain canonical URLs, not redirect aliases.
- Examples do not contradict the prose.
- Repeated transition formulas, consecutive slogan-like short sentences, and forced section-ending maxims have been reduced without flattening the author's voice.
- Sentence and paragraph lengths vary according to meaning and do not follow a uniform short-form template.
- No placeholder, TODO, drafting note, secret, or future-dated sample remains.
- `git diff --check` passes.
- Run the Jekyll build when Ruby/Bundler is available. Report the missing dependency instead of claiming a successful build when it is unavailable.
- Inspect `git diff` and summarize all article, asset, and shared-template changes.

Do not commit, push, publish, or use LinkedIn Post Inspector unless the user separately requests that action.
