import { cpSync, mkdirSync, copyFileSync } from 'node:fs';
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
cpSync('_site', 'dist/client', { recursive: true });
copyFileSync('worker/index.js', 'dist/server/index.js');
copyFileSync('.openai/hosting.json', 'dist/.openai/hosting.json');
