import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import worker from '../dist/server/index.js';
const client = path.resolve('dist/client');
const assets = {async fetch(request) {
  const pathname = new URL(request.url).pathname;
  const filename = path.join(client, pathname);
  try {
    if (!(await stat(filename)).isFile()) return new Response(null,{status:404});
    return new Response(await readFile(filename), {headers:{'Content-Type':'application/octet-stream','X-Robots-Tag':'noindex'}});
  } catch { return new Response(null,{status:404}); }
}};
test('all sitemap pages bypass asset-first routing and serve canonical HTML',async()=>{
  const sitemap = await readFile(path.join(client,'sitemap.xml'),'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  assert.ok(urls.length > 250);
  for(const url of urls) {
    const request = new Request(url);
    const p = new URL(url).pathname;
    if (p.endsWith('.pdf')) { assert.equal((await assets.fetch(request)).status,200); continue; }
    assert.equal((await assets.fetch(request)).status,404,p+' must reach Worker');
    const response = await worker.fetch(request,{ASSETS:assets});
    assert.equal(response.status,200,p);
    assert.match(response.headers.get('content-type'),/^text\/html/);
    assert.equal(response.headers.get('x-robots-tag'),null);
    assert.ok((await response.text()).includes('href="'+url+'"'),p+' canonical');
  }
});
test('packaged error page is a real HTML 404',async()=>{
  const response = await worker.fetch(new Request('https://fmarslan.com/nonexistent-check'),{ASSETS:assets});
  assert.equal(response.status,404);
  assert.match(await response.text(),/<html/);
});
test('internal HTML storage is excluded from crawling',async()=>{
  assert.match(await readFile(path.join(client,'robots.txt'),'utf8'),/Disallow: \/__site_pages\//);
});
