import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const output = resolve('dist/client');
const html = readFileSync(resolve(output, 'index.html'), 'utf8');
const momentsHtml = readFileSync(resolve(output, 'moments/index.html'), 'utf8');
const { publications } = JSON.parse(
  readFileSync('content/publications.json', 'utf8'),
);
const source = readFileSync('components/bouldering-research.tsx', 'utf8');
const photos = JSON.parse(readFileSync('content/photos.json', 'utf8'));
const places = JSON.parse(readFileSync('content/footprints.json', 'utf8'));
const countries = JSON.parse(readFileSync('content/world-map.json', 'utf8'));
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
  'moments/index.html',
  'moments.rsc',
  '404.html',
  'favicon.svg',
  'artwork/climbing-poses.png',
  'artwork/quantum-holds.png',
  'artwork/climbing-wall.png',
  'photos/yingjian-liu.jpg',
  ...photos.map((photo) => photo.src.slice(1)),
]) {
  assert(existsSync(resolve(output, path)), `Missing public asset: ${path}`);
  assert(
    statSync(resolve(output, path)).size > 0,
    `Empty public asset: ${path}`,
  );
}
assert(
  html.includes('href="/moments/"'),
  'The personal page is not linked from the homepage.',
);
assert(
  !html.includes('class="photo-grid"') &&
    !html.includes('class="footprints-map"'),
  'Personal sections remain on the homepage.',
);
assert(
  momentsHtml.includes('Moments') && momentsHtml.includes('Footprints'),
  'Missing personal sections.',
);
assert(
  momentsHtml.includes('https://eugeneliu2000.github.io/moments/'),
  'Personal page canonical URL is missing.',
);
assert(
  !momentsHtml.includes('China (including Taiwan)'),
  'The old map label remains.',
);
assert(
  html.indexOf('id="paper-') < html.indexOf('id="publication-wall"'),
  'The publication list must precede the wall.',
);
assert(
  /aria-expanded="true"[^>]*>[\s\S]*?All/.test(html),
  'The publication list is not expanded by default.',
);
let previousPhotoPosition = -1;
for (const photo of [...photos].sort((a, b) => a.date.localeCompare(b.date))) {
  const position = momentsHtml.indexOf(`src="${photo.src}"`);
  assert(
    position > previousPhotoPosition,
    `Missing or out-of-order photo: ${photo.src}`,
  );
  previousPhotoPosition = position;
  assert(
    photo.width > 0 && photo.height > 0,
    `Missing image dimensions: ${photo.src}`,
  );
}
for (const code of places.flatMap((place) => place.codes)) {
  assert(
    countries.some((country) => country.code === code),
    `Missing country geometry: ${code}`,
  );
  assert(
    momentsHtml.includes(`data-country="${code}" data-visited="true"`),
    `Country was not highlighted: ${code}`,
  );
}
const assetPaths = [
  ...(html + momentsHtml).matchAll(
    /(?:src|href)="(\/_next\/[^"?#]+)(?:[?#][^"]*)?"/g,
  ),
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
  `Static export verified: ${publications.length} papers, ${photos.length} moments, ${places.length} visited places, ${new Set(assetPaths).size} client assets.`,
);
