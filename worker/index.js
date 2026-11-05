export function createSiteWorker(routes, aliases = {}) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status: 405, headers: {Allow: 'GET, HEAD'}});
      const route = routes[url.pathname];
      const destination = aliases[url.pathname] || route?.canonical || url.pathname;
      const alternateHost = url.hostname === 'www.fmarslan.com' || url.hostname === 'fmarslan.fmarslan.chatgpt.site';
      if (alternateHost || destination !== url.pathname) {
        url.hostname = 'fmarslan.com';
        url.protocol = 'https:';
        url.port = '';
        url.pathname = destination;
        return Response.redirect(url.href, 308);
      }
      // Fetch stored HTML internally so asset-first URL normalization cannot
      // override the public canonical route.
      const assetUrl = new URL(request.url);
      if (route) assetUrl.pathname = route.asset;
      const response = await env.ASSETS.fetch(new Request(assetUrl, request));
      if (response.status !== 404 && url.pathname !== '/404.html') {
        if (!route) return response;
        const headers = new Headers(response.headers);
        headers.set('Content-Type', 'text/html; charset=utf-8');
        headers.delete('X-Robots-Tag');
        return new Response(request.method === 'HEAD' ? null : response.body, {status: response.status, headers});
      }
      const notFoundPath = routes['/404.html']?.asset || '/__site_pages/404.html.bin';
      const notFound = await env.ASSETS.fetch(new Request(new URL(notFoundPath, request.url), request));
      const headers = new Headers(notFound.headers);
      headers.delete('Location');
      headers.set('Content-Type', 'text/html; charset=utf-8');
      headers.set('X-Robots-Tag', 'noindex');
      return new Response(request.method === 'HEAD' ? null : notFound.body, {status: 404, headers});
    }
  };
}
