---
layout: post
title: "Jekyll, GitHub Pages and Static Sites: Launching a Simple Site from Scratch"
date: 2025-11-24
description: "A practical step-by-step guide explaining what static site generators (especially Jekyll) are, how you can publish to GitHub Pages, and alternative hosting solutions."
image: /assets/img/717eb0e5-78ae-4359-a524-a7a1df7ac11b.png
tags:
  - jekyll
  - github-pages
  - static-site
  - jamstack
  - devops
lang: en-US
translation_key: "jekyll-github-pages-ve-statik-siteler-a82073a2"
permalink: /en/2025/11/24/jekyll-github-pages-and-static-sites-launching-a-simple-site-from-scratch.html
---

In recent years, dynamic systems such as **WordPress** have gradually begun to be replaced by simpler, faster and more maintainable structures: **static site generators**.

In this article:

- The concept of static site and static site generator,
- Some popular alternatives, especially Jekyll,
- How to prepare a **simple one-page site** with Jekyll,
- How you can publish this site on **GitHub Pages**,
- And alternative hosting solutions to GitHub Pages

I will summarize it in practical language.

---

## What is a static site, what is a static site generator?

**Static site**: These are simple structures where **HTML, CSS and JS** files are served directly via CDN, without running a backend such as PHP, Node.js, database on the server.

**Static site generators (SSG)**:

- Import Markdown, HTML, data files (YAML/JSON) and templates,
- By processing these during build,
- Ultimately produces a completely static HTML output.

It is advantageous in terms of performance; Because the page is not generated dynamically with every request, it is pre-built.

---

## Popular static site generators

There are many SSGs on the market today. Some of the highlights:

- **Jekyll (Ruby)** — A classic, blog-focused, file-based framework. It is also the engine of GitHub Pages.
- **Hugo (Go)** — Known for its very fast build times, it can produce sites with thousands of pages in seconds.
- **Eleventy (JavaScript)** — A minimalist SSG for those who say "Keep it simple, let me decide what to do."
- **Astro (JavaScript)** — A modern approach for content-oriented sites, component-based, one of the rising stars of the recent period.

In this article, we will focus specifically on **Jekyll**; because:

- Very suitable for simple blogs and personal sites,
- File-based, relatively easy to learn,
- It works natively integrated with GitHub Pages.

---

## Let's take a closer look at Jekyll

Jekyll:

- You generally write the content as **Markdown**,
- Use **Liquid** and HTML for templating,
- Ultimately, it allows you to produce a static site.  
- You can create a new site, get build, and run a local development server with a single command.

One of the best things about Jekyll is that it acts like a **“file-based CMS”**: _posts folder, pages, layouts, etc. They are all files. No database, no admin panel; just Git and files.

---

## Preparing the environment: Ruby + Jekyll installation

Basic requirements for running Jekyll:

- Ruby 2.7 or above
-RubyGems
- GCC and Make (comes ready in most *nix environments)

Jekyll and Bundler installation command:

```bash
gem install bundler jekyll
```

After installation, you can check the version with the `jekyll -v` command.

---

## Step by step: One page Jekyll site

Now let's create a **simple one-page site** from scratch.

### 1. Create new project

In terminal:

```bash
cd ~/Projects
jekyll new my-first-jekyll-site
cd my-first-jekyll-site
```

### 2. Load required gems

```bash
bundle install
```

### 3. Simplifying default contents to a single page

* You can delete the `_posts` folder or leave it empty for now.
* If you do not need the `about.markdown` file, you can remove it.

You can open the file `index.markdown` (or `index.md`) and simplify the content like this:

```markdown
---
layout: default
title: "Merhaba Jekyll"
---

# Merhaba Jekyll

Bu, Jekyll ile hazırlanmış **tek sayfalık** basit bir sitedir.

- İçeriği Markdown ile yazıyorum.
- Jekyll bunu HTML'e çeviriyor.
- Sonucu GitHub Pages üzerinde yayınlayacağım.

Alt tarafta bir bölüm daha:

## Hakkımda

Kısaca kendimden bahsettiğim bir alan burası olabilir.
```

### 4. Setting up a simple layout (optional but recommended)

Open the `_layouts/default.html` file and create a simple HTML skeleton like this:

{%raw%}
```html
<!DOCTYPE html>
<html lang="tr">
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }} - {{ site.title }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { max-width: 720px; margin: 2rem auto; font-family: system-ui, sans-serif; line-height: 1.6; padding: 0 1rem; }
      h1, h2, h3 { margin-top: 2rem; }
      a { text-decoration: none; }
    </style>
  </head>
  <body>
    <header>
      <h1>{{ site.title }}</h1>
      <p>{{ site.description }}</p>
      <hr>
    </header>

    <main>
      {{ content }}
    </main>
  </body>
</html>
```
{% endraw %}

And to the file `_config.yml`:

```yaml
title: "Benim İlk Jekyll Sitem"
description: "Jekyll ve GitHub Pages ile hazırlanmış basit bir tek sayfa"
```

Add “site information” as follows.

### 5. Run locally and start checking

In terminal:

```bash
bundle exec jekyll serve
```

You can usually see the site at `http://localhost:4000`.

---

## What are GitHub Pages?

**GitHub Pages** is a **static site hosting service** that takes static files from a repository on GitHub and automatically turns them into a website.

* You can directly publish your HTML, CSS, JS files,
* If you want, you can go through the build process with Jekyll and publish it,
* It can be used in many scenarios such as personal site, project documentation, blog.Its integration with Jekyll is very strong; GitHub Pages uses Jekyll as its “built-in static site engine.”

---

## Step by step: Publishing your Jekyll site to GitHub Pages

### 1. Create a new repository on GitHub

* For personal site: repo named `kullaniciadiniz.github.io` (classic “user/organization site” approach).
* For project-based site: For example, a normal repo like `my-first-jekyll-site`.

### 2. Link your Jekyll project with Git

While in the project folder in terminal:

```bash
git init
git remote add origin git@github.com:kullaniciadiniz/my-first-jekyll-site.git
git add .
git commit -m "Initial Jekyll site"
git push -u origin main
```

### 3. Enable GitHub Pages

Go to the repo page and:

* In **Settings → Pages**
* In the “Source” section:

  * `main` as Branch
  * `/` or `/docs` as Folder

Choose your structure as follows.

> Attention: GitHub Pages supports certain plugins and versions on the Jekyll side. If you want to use custom plugins, it is generally more flexible to take your own Jekyll build with GitHub Actions and publish the `_site` output to a separate branch (e.g. `gh-pages`).

### 4. Check your site address

After waiting a bit (initial build may take time):

* If the user site is: `https://kullaniciadiniz.github.io`
* Project site: `https://kullaniciadiniz.github.io/my-first-jekyll-site/`

You can visit the address.

### 5. Custom domain (optional)

To use your own domain (for example `fmarslan.com`) with GitHub Pages:

* In the repo settings, enter the domain in **Pages → Custom domain**,
* On the DNS side, set the `CNAME` or `A` records as recommended by GitHub.

---

## An example: fmarslan.com

My own personal site **[fmarslan.com](https://fmarslan.com/)** is structured as a Jekyll + GitHub Pages site. There is the phrase “GitHub Pages · Jekyll” at the bottom of the homepage. (See page source code) ([F.M. Arslan][1])

You can also review the source codes of this site via the **[`fmarslan/fmarslan.github.io`](https://github.com/fmarslan/fmarslan.github.io)** repo on GitHub. This could serve as an example of “how I made my own site.”

---

## Alternative static site hosting solutions to GitHub Pages

GitHub Pages is more than sufficient in most scenarios; But especially when you need more advanced features, these alternatives stand out:

* **Netlify** — Automatic build & deploy from your Git repos; It offers additional features such as form capture and edge functions.
* **Cloudflare Pages** — Static site hosting on Cloudflare's global network; Automatic build & deploy from git repo.
* **Vercel** — Especially popular for Next.js and modern frontend projects; With static + serverless function support.
* **GitLab Pages** — If you use GitLab, a convenient option for publishing a static site from within GitLab.

---

## Which combination makes sense where?

In summary:

* **In scenarios such as personal blog, simple documentation, portfolio**:
  Jekyll + GitHub Pages is an effortless combination that you can say “Git push = deploy”.

* **For larger, multilingual, hundreds to thousands of pages of content**:
  Alternatives like Hugo, Eleventy or Astro + Netlify / Vercel / Cloudflare Pages may be more flexible.

* **For teams using GitLab**:
  GitLab Pages + any SSG (including Jekyll) is a natural choice.

My practical approach is generally as follows:

1. First **clarify the need**: blog, documentation, campaign landings?
2. Then think about **content production speed**: Are you in the habit of writing with Markdown?
3. Finally, choose the hosting service that is closest to the Git platform you are using: GitHub → GitHub Pages / Netlify, GitLab → GitLab Pages / Cloudflare Pages, etc.

My goal is that after reading this article, you will be able to open the terminal and create your first Jekyll site and publish it on GitHub Pages in 15-20 minutes.

If you apply these instructions in your Jekyll installation on fmarslan.com and need additional configuration or help on the theme side, we can also go into theme, multi-language and deploy pipeline details in the follow-up article.

## References

- [Ruby][ref-ruby]
- [Jekyll][ref-jekyll]
- [GitHub Pages][ref-gh-pages]

[ref-ruby]: https://www.ruby-lang.org/
[ref-jekyll]: https://jekyllrb.com/
[ref-gh-pages]: https://pages.github.com/

[1]: https://fmarslan.com/
