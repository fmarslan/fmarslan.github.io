---
name: prepare-blog-post
description: Prepare and enrich fmarslan.com Jekyll articles for publication. Use when the user says an article is mature, asks to make a post publication-ready, says "makaleyi yayına hazırla", requests final editorial polish, or wants the full article package including a simple cover, introduction, metadata, SEO/social preview, tags, diagrams, code examples, and release checks.
---

# Prepare Blog Post

Turn a mature draft into a complete fmarslan.com post. Work autonomously inside this repository and preserve the author's argument and voice.

## Workflow

### 1. Inspect the repository and article

- Read `_config.yml`, `_layouts/base.html`, `_layouts/post.html`, and two recent posts before editing.
- Resolve the target post under `_posts/`.
- Preserve unrelated worktree changes.
- Confirm the article language from its content. Use clear B2-C1 English for English posts and natural, direct Turkish for Turkish posts.
- Treat “prepare for publication” as content preparation, not permission to commit, push, or deploy.

### 2. Mature the content

- Identify the central claim and make every section support it.
- Remove repeated arguments, editorial notes, unsupported certainty, and unnecessary background.
- Separate sourced facts from the author's inference.
- Check cited sources directly when a claim depends on them.
- Use concrete examples and plain technical language. Let sentence and paragraph length follow the thought being expressed: mix short, medium, and long constructions as a real author naturally would, without optimizing for uniformly short paragraphs or imposing a mechanical rhythm.
- Preserve important trade-offs; do not turn a problem-analysis article into a sales pitch for one solution.
- Define nonstandard terms as local wording. Prefer established terminology when a reliable source provides one.

#### Keep the editorial rhythm natural

- Use transition formulas such as “Asıl problem şu”, “Bu noktada”, “Kritik gerçek”, “Kural basit”, “En net çıkarım”, and “Son olarak” sparingly. Do not repeat the same formula across sections or introduce a claim with one when the preceding context already makes it clear.
- Avoid sequences of short, emphatic sentences written only to create drama. Combine related thoughts into complete paragraphs unless a short sentence carries necessary contrast or technical emphasis.
- Do not normalize paragraphs to a uniform size. Allow a developed argument to remain a substantial paragraph, use a short paragraph only when the idea genuinely benefits from isolation, and vary syntax rather than repeating the same sentence shape.
- Do not end every section with a slogan, maxim, bold declaration, or artificially definitive conclusion. Let evidence, examples, uncertainty, or a transition carry the reader forward when appropriate.
- Prefer specific observations, mechanisms, constraints, and consequences over generic declarations such as “the real issue is…”, “everything changes here”, or “this is critical”.
- Preserve the author’s genuinely concise or emphatic lines when they are distinctive and earned by the argument; reduce patterns, not personality.
- During the final edit, scan headings, paragraph openings, blockquotes, bold lines, and section endings for repeated rhetorical templates. Rewrite enough instances to prevent an AI-polished or LinkedIn-style cadence.

### 3. Enrich technical explanation

Use only visuals that improve understanding:

- Use Mermaid for architecture, flow, sequence, or dependency diagrams.
- Use Markdown tables for mappings, option comparisons, role matrices, and repeated field relationships.
- Use concise code blocks for the main alternatives discussed in the article.
- Keep all diagrams, tables, and code examples consistent with the same running example.
- Verify Mermaid fences and syntax against the repository's existing Mermaid support.
- Do not add decorative diagrams or duplicate prose in visual form.

### 4. Write the opening

The rendered post body must begin in this order:

1. A one- or two-sentence introduction that states the problem and gives the reader a reason to continue.
2. The cover image with useful alt text.
3. The article body.

Do not start with the image. Do not repeat the front-matter description word for word in the introduction.

### 5. Create the cover

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
- Reference the same image from front matter and the article body.
- Inspect the generated image before accepting it. Regenerate once when it violates the palette, simplicity, or no-text rules.

Use the available image-generation skill/tool for raster cover creation and follow its save/validation workflow.

### 6. Complete front matter

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
published: false
---
```

Rules:

- Keep `description` specific, useful, and normally 120-180 characters.
- Make the description summarize the article's decision or trade-off, not the author biography.
- Use `lang: en-US` for English and `lang: tr-TR` for Turkish.
- Use three to six lowercase, focused tags.
- Ensure the filename date and front-matter date match.
- Use an English kebab-case slug unless the user requests otherwise.
- Keep `published: false` while preparing a draft. Remove it or set it to `true` only when the user explicitly asks to publish.
- Do not add unsupported front-matter fields. The article's share image serves as its visual icon unless the layouts later add a dedicated icon field.

### 7. Verify SEO and social preview metadata

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
- If the layout is wrong, fix it once at the shared template instead of adding page-specific HTML.

### 8. Final quality checks

Verify all of the following:

- Front matter is valid and complete.
- Filename, date, language, title, and slug agree.
- The introduction appears before the cover.
- The cover exists, renders, has alt text, and follows the two-or-three-color rule.
- Headings form a clear hierarchy and do not duplicate the layout's H1.
- Tables render and contain aligned columns.
- Code fences are balanced.
- Mermaid blocks are balanced and supported by the site.
- Links are valid and tracking parameters are removed.
- Examples do not contradict the prose.
- Repeated transition formulas, consecutive slogan-like short sentences, and forced section-ending maxims have been reduced without flattening the author's voice.
- Sentence and paragraph lengths vary according to meaning and do not follow a uniform short-form template.
- No placeholder, TODO, drafting note, secret, or future-dated sample remains.
- `git diff --check` passes.
- Run the Jekyll build when Ruby/Bundler is available. Report the missing dependency instead of claiming a successful build when it is unavailable.
- Inspect `git diff` and summarize all article, asset, and shared-template changes.

Do not commit, push, publish, or use LinkedIn Post Inspector unless the user separately requests that action.
