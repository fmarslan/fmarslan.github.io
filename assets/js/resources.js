document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.resource-filter');
  const cards = document.querySelectorAll('.resource-card');
  const empty = document.querySelector('.resources-empty');
  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach(item => {
      item.classList.toggle('is-active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    let visible = 0;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.tags.split(',').includes(filter);
      card.hidden = !show;
      if (show) visible += 1;
    });
    empty.hidden = visible !== 0;
  }));
});
