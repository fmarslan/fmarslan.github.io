import test from 'node:test';
import assert from 'node:assert/strict';
import {createSiteWorker} from '../worker/index.js';
const worker = createSiteWorker({
  '/article.html': {canonical: '/article.html', asset: '/article'},
  '/article': {canonical: '/article.html', asset: '/article'},
  '/blog/': {canonical: '/blog/', asset: '/blog/'},
  '/blog/index.html': {canonical: '/blog/', asset: '/blog/'},
  '/search': {canonical: '/search', asset: '/search'},
  '/search.html': {canonical: '/search', asset: '/search'},
}, {'/en/':'/'});
const env = {ASSETS: {async fetch(request) {
  const p = new URL(request.url).pathname;
  if (p.endsWith('.html')) return Response.redirect(new URL(p.slice(0,-5),request.url),307);
  if (['/article','/blog/','/search','/404','/'].includes(p)) return new Response('<html>content</html>',{headers:{'Content-Type':'text/html'}});
  return new Response(null,{status:404});
}}};
test('historical .html articles return HTML without redirecting',async()=>{
  const r=await worker.fetch(new Request('https://fmarslan.com/article.html?utm_source=test'),env);
  assert.equal(r.status,200); assert.equal(r.headers.get('location'),null); assert.match(await r.text(),/content/);
});
test('alternate host and URL normalize in one permanent redirect, preserving query',async()=>{
  for(const host of ['www.fmarslan.com','fmarslan.fmarslan.chatgpt.site']) {
    const r=await worker.fetch(new Request(`https://${host}/article?utm_source=test`),env);
    assert.equal(r.status,308); assert.equal(r.headers.get('location'),'https://fmarslan.com/article.html?utm_source=test');
  }
});
test('directory and utility aliases retain their canonical URLs',async()=>{
  for(const [from,to] of [['/blog/index.html','/blog/'],['/search.html','/search'],['/en/','/']]) {
    const r=await worker.fetch(new Request('https://fmarslan.com'+from),env);
    assert.equal(r.status,308); assert.equal(r.headers.get('location'),'https://fmarslan.com'+to);
  }
});
test('missing pages remain genuine 404s and cannot be indexed',async()=>{
  const r=await worker.fetch(new Request('https://fmarslan.com/missing'),env);
  assert.equal(r.status,404); assert.equal(r.headers.get('x-robots-tag'),'noindex');
});
