(() => {
  const notice = document.getElementById('language-suggestion');
  if (!notice || document.documentElement.lang !== 'en') return;

  const language = navigator.languages?.[0] || navigator.language || '';
  if (!/^tr(?:-|$)/i.test(language)) return;

  // A page session is scoped to a browser tab, including reloads and navigation.
  // Mark on display so even an undismissed notice does not recur on another page.
  try {
    if (sessionStorage.getItem('fmarslan:language-suggestion:v1')) return;
    sessionStorage.setItem('fmarslan:language-suggestion:v1', 'shown');
  } catch (_) {
    // Without session storage we cannot honour once-per-session; stay unobtrusive.
    return;
  }

  notice.hidden = false;
  notice.querySelector('button').addEventListener('click', () => {
    notice.hidden = true;
  });
})();
