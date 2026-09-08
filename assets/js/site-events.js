(() => {
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || typeof window.gtag !== 'function') return;
    const href = link.getAttribute('href');
    // Do not send email addresses, query strings or link text to Analytics.
    if (href.startsWith('mailto:')) {
      window.gtag('event', 'contact_email_click', { transport_type: 'beacon' });
    } else if (link.pathname?.endsWith('.pdf') && link.pathname.includes('-cv.')) {
      window.gtag('event', 'cv_download_click', { transport_type: 'beacon' });
    }
  });
})();
