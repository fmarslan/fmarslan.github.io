import {cp, mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const source = path.join(root, '_site');
const output = path.join(root, 'dist');
if (output !== path.resolve(root, 'dist') || path.basename(output) !== 'dist') throw new Error('Unexpected build directory');
await rm(output, {recursive: true, force: true});
await mkdir(path.join(output, 'server'), {recursive: true});
await cp(source, path.join(output, 'client'), {recursive: true});
await cp(path.join(root, '.openai'), path.join(output, '.openai'), {recursive: true});
const routes = Object.create(null);
async function walk(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    const relative = '/' + path.relative(source, file).split(path.sep).join('/');
    const html = await readFile(file, 'utf8');
    const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1];
    if (!canonical) continue;
    const canonicalPath = new URL(canonical).pathname;
    const publicAlias = relative.endsWith('/index.html') ? relative.slice(0, -10) : relative.slice(0, -5);
    // Keep HTML out of asset-first routing, which otherwise redirects .html
    // before the Worker can preserve Jekyll's canonical article addresses.
    const asset = '/__site_pages' + relative + '.bin';
    const assetFile = path.join(output, 'client', asset);
    await mkdir(path.dirname(assetFile), {recursive: true});
    await cp(file, assetFile);
    await rm(path.join(output, 'client', relative));
    const route = {canonical: canonicalPath, asset};
    routes[relative] = route;
    routes[publicAlias] = route;
    if (relative.endsWith('/index.html') && publicAlias !== '/') routes[publicAlias.slice(0,-1)] = route;
  }
}
await walk(source);
const robots = await readFile(path.join(source, 'robots.txt'), 'utf8');
await writeFile(path.join(output, 'client', 'robots.txt'), robots.replace('Allow: /', 'Allow: /\nDisallow: /__site_pages/'));
const aliases = JSON.parse(await readFile(path.join(root, '_data/url_aliases.json'), 'utf8'));
const worker = await readFile(path.join(root, 'worker/index.js'), 'utf8');
await writeFile(path.join(output, 'server/index.js'), worker + '\nexport default createSiteWorker(' + JSON.stringify(routes) + ',' + JSON.stringify(aliases) + ');\n');
console.log(`Packaged ${Object.keys(routes).length} URL forms with canonical routing.`);
