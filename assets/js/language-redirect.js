(() => {
  const html = document.documentElement;
  const currentLanguage = html.lang || 'tr';
  const alternateUrl = html.dataset.alternateUrl;

  if (!alternateUrl || sessionStorage.getItem('language-redirected') === 'true') {
    return;
  }

  const preferredLanguage = (navigator.languages && navigator.languages[0])
    || navigator.language
    || 'tr';
  const targetLanguage = preferredLanguage.toLowerCase().startsWith('en') ? 'en' : 'tr';

  if (targetLanguage !== currentLanguage) {
    sessionStorage.setItem('language-redirected', 'true');
    window.location.replace(alternateUrl);
  }
})();
