import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const output = resolve('dist/client');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const { publications } = JSON.parse(
  readFileSync('content/publications.json', 'utf8'),
);
const source = readFileSync('components/bouldering-research.tsx', 'utf8');
assert(html.includes('Yingjian Liu'), 'The homepage was not prerendered.');
assert(!html.includes('Untitled site'), 'Starter metadata remains.');
assert(
  html.includes('https://eugeneliu2000.github.io'),
  'Canonical site metadata is missing.',
);
for (const paper of publications) {
  assert(
    html.includes(`paper-${paper.arxiv}`),
    `Missing publication ${paper.arxiv}`,
  );
  assert(
    source.includes(`id: '${paper.arxiv}'`),
    `No climbing hold for ${paper.arxiv}`,
  );
  assert(
    html.includes(paper.arxivUrl),
    `Missing arXiv link for ${paper.arxiv}`,
  );
}
for (const path of [
  '404.html',
  'favicon.svg',
  'artwork/climbing-poses.png',
  'artwork/quantum-holds.png',
]) {
  assert(existsSync(resolve(output, path)), `Missing public asset: ${path}`);
  assert(
    statSync(resolve(output, path)).size > 0,
    `Empty public asset: ${path}`,
  );
}
const assetPaths = [
  ...html.matchAll(/(?:src|href)="(\/_next\/[^"?#]+)(?:[?#][^"]*)?"/g),
].map((match) => match[1]);
assert(assetPaths.length > 0, 'No client assets were found.');
for (const path of assetPaths)
  assert(
    existsSync(resolve(output, path.slice(1))),
    `Broken client asset: ${path}`,
  );
assert(
  !html.includes('localhost:3000'),
  'A local preview URL remains in the export.',
);
console.log(
  `Static export verified: ${publications.length} papers, two illustration assets, ${new Set(assetPaths).size} client assets.`,
);
