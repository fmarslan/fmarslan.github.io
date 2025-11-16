---
layout: page
title: Search
eyebrow: Internal tools
description: Explore archived notes and blog posts with Google Custom Search.
permalink: /search
robots: noindex
sitemap: false
---

<script async src="https://cse.google.com/cse.js?cx=10c8c4b89d747daac"></script>

<div class="search-panel">
  <p>Use any keywords from the blog, platform case studies, or technologies I’ve written about.</p>
  <form class="inline-search search-page-form" action="{{ page.url | relative_url }}" method="get">
    <label class="sr-only" for="site-search-input">Search posts</label>
    <input type="search" id="site-search-input" name="q" placeholder="Search articles..." required>
    <button type="submit">Search</button>
  </form>
</div>

<div class="search-results">
  <div class="gcse-searchresults-only" data-gname="siteSearch" data-queryParameterName="q"></div>
</div>

<script>
  (function () {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      var input = document.getElementById('site-search-input');
      if (input) {
        input.value = q;
      }
    }
  })();
</script>
