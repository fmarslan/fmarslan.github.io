(() => {
  const form = document.querySelector('[data-blog-search]');
  const grid = document.querySelector('[data-blog-posts]');
  const status = document.querySelector('[data-blog-search-status]');

  if (!form || !grid || !status) return;

  const input = form.querySelector('input[type="search"]');
  const language = form.dataset.language || 'tr';
  const indexUrl = form.dataset.index;
  const originalMarkup = grid.innerHTML;
  let postsPromise;
  let timer;

  const normalize = (value) => String(value || '')
    .toLocaleLowerCase(language === 'tr' ? 'tr-TR' : 'en-US')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u');

  const getPosts = () => {
    if (!postsPromise) {
      postsPromise = fetch(indexUrl)
        .then((response) => {
          if (!response.ok) throw new Error(`Search index returned ${response.status}`);
          return response.json();
        })
        .then((posts) => posts.filter((post) => post.lang.toLowerCase().startsWith(language)));
    }
    return postsPromise;
  };

  const scorePost = (post, terms) => {
    const title = normalize(post.title);
    const tags = normalize((post.tags || []).join(' '));
    const description = normalize(post.description);
    const content = normalize(post.content);
    let score = 0;

    for (const term of terms) {
      const found = title.includes(term)
        || tags.includes(term)
        || description.includes(term)
        || content.includes(term);
      if (!found) return 0;
      if (title.includes(term)) score += 8;
      if (tags.includes(term)) score += 5;
      if (description.includes(term)) score += 3;
      if (content.includes(term)) score += 1;
    }
    return score;
  };

  const formatDate = (value) => new Intl.DateTimeFormat(
    language === 'tr' ? 'tr-TR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' }
  ).format(new Date(value));

  const renderResults = (posts, query) => {
    grid.replaceChildren();

    for (const post of posts) {
      const article = document.createElement('article');
      article.className = 'post-card';

      const content = document.createElement('div');
      content.className = 'post-card__content';

      const meta = document.createElement('div');
      meta.className = 'post-card__meta';

      const time = document.createElement('time');
      time.dateTime = post.date;
      time.textContent = formatDate(post.date);

      const heading = document.createElement('h2');
      const titleLink = document.createElement('a');
      titleLink.href = post.url;
      titleLink.textContent = post.title;
      heading.append(titleLink);

      const description = document.createElement('p');
      description.textContent = post.description;

      const readMore = document.createElement('a');
      readMore.className = 'read-more';
      readMore.href = post.url;
      readMore.textContent = form.dataset.readMore;

      meta.append(time);
      content.append(meta, heading, description, readMore);
      article.append(content);
      grid.append(article);
    }

    status.textContent = posts.length
      ? form.dataset.results.replace('{count}', posts.length).replace('{query}', query)
      : form.dataset.noResults.replace('{query}', query);
  };

  const search = async () => {
    const query = input.value.trim();
    const url = new URL(window.location.href);

    if (!query) {
      url.searchParams.delete('q');
      window.history.replaceState({}, '', url);
      grid.innerHTML = originalMarkup;
      status.textContent = '';
      return;
    }

    url.searchParams.set('q', query);
    window.history.replaceState({}, '', url);

    if (normalize(query).length < 2) {
      grid.innerHTML = originalMarkup;
      status.textContent = form.dataset.minChars;
      return;
    }

    try {
      const terms = normalize(query).split(/\s+/).filter(Boolean);
      const posts = await getPosts();
      const results = posts
        .map((post) => ({ post, score: scorePost(post, terms) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date))
        .slice(0, 20)
        .map((item) => item.post);
      renderResults(results, query);
    } catch (error) {
      status.textContent = form.dataset.error;
      console.error(error);
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    search();
  });

  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(search, 160);
  });

  const initialQuery = new URL(window.location.href).searchParams.get('q');
  if (initialQuery) {
    input.value = initialQuery;
    search();
  }
})();
