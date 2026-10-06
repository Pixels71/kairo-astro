import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    return [k, v.length ? v.join('=') : 'true'];
  }),
);
const out = path.resolve(root, args.out ?? '../jobfit-astro-prod');
const sharp = createRequire(path.join(root, 'package.json'))('sharp');
sharp.cache(false);

const skipTop = new Set(['.git', '.astro', 'dist', 'node_modules', 'bun.lock', '.claude', 'AGENTS.md', 'CLAUDE.md']);
const unusedAssets = [
  'ns-img-240.png',
  'ns-img-352.png',
  'ns-img-356.png',
  'ns-img-36.png',
  'ns-img-37.png',
  'ns-img-38.png',
  'ns-img-39.png',
  'ns-img-40.png',
  'ns-img-41.png',
  'ns-img-495.png',
  'ns-img-508.png',
  'ns-img-515.png',
  'ns-img-7.svg',
  'ns-img-73.png',
  'ns-img-dark-11.png',
  'ns-img-dark-161.png',
  'ns-img-dark-17.png',
  'ns-img-dark-18.png',
  'ns-img-dark-19.png',
  'ns-img-dark-20.png',
  'ns-img-dark-21.png',
  'ns-img-dark-22.png',
  'ns-img-dark-5.svg',
  'shared/main-logo-light.svg',
];
const keepAsIs = [
  /^ns-author-avatar-bg\.png$/,
  /^ns-img-(14|25|391|496|498|499|501|509|510|516)\.png$/,
  /^ns-img-(339|340|350|517)\.(png|jpg)$/,
  /^ns-img-(67|68|69|70|71|72)\.png$/,
];
const light = { bg: '#dfe5ec', line: '#c9d2dc', text: '#6f7f91', sub: '#91a0b0' };

if (fs.existsSync(out) && !args.force) {
  console.error(`${out} exists. Use --force to rebuild it.`);
  process.exit(1);
}
const linkedModules = path.join(out, 'node_modules');
if (fs.existsSync(linkedModules)) {
  try {
    fs.rmdirSync(linkedModules);
  } catch {
    process.exit(1);
  }
}
try {
  fs.rmSync(out, { recursive: true, force: true });
} catch (error) {
  console.error(`Could not clear ${out}: ${error.code}. Close terminals, editors and servers that use it, then retry.`);
  process.exit(1);
}

fs.cpSync(root, out, {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(root, src);
    return !rel || !skipTop.has(rel.split(path.sep)[0]);
  },
});

const configPath = path.join(out, 'astro.config.ts');
fs.writeFileSync(
  configPath,
  fs.readFileSync(configPath, 'utf8').replace(/site: '[^']*'/, "site: 'https://your-domain.com'"),
);

const assets = path.join(out, 'assets/images');
for (const rel of unusedAssets) fs.rmSync(path.join(assets, rel), { force: true });

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]));

const svgFor = (w, h, name, palette) => {
  const m = Math.min(w, h);
  const stroke = Math.max(1, m / 400);
  const label = m >= 160 ? `${w} × ${h}` : '';
  const sub = m >= 260 ? name : '';
  const font = 'Segoe UI, Arial, Helvetica, sans-serif';
  const text = label
    ? `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="${font}" font-size="${Math.round(m * 0.16)}" font-weight="600" fill="${palette.text}">${label}</text>`
    : '';
  const caption = sub
    ? `<text x="50%" y="${Math.round(h * 0.5 + m * 0.17)}" text-anchor="middle" font-family="${font}" font-size="${Math.round(m * 0.06)}" fill="${palette.sub}">${sub}</text>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="${palette.bg}"/><line x1="0" y1="0" x2="${w}" y2="${h}" stroke="${palette.line}" stroke-width="${stroke}"/><line x1="${w}" y1="0" x2="0" y2="${h}" stroke="${palette.line}" stroke-width="${stroke}"/>${text}${caption}</svg>`;
};

const written = { placeholders: 0, kept: 0, svg: 0 };
for (const file of walk(assets)) {
  const rel = path.relative(assets, file).split(path.sep).join('/');
  if (/\.svg$/i.test(rel)) {
    written.svg += 1;
    continue;
  }
  if (!/\.(jpe?g|png|webp)$/i.test(rel)) continue;
  if (keepAsIs.some((re) => re.test(rel))) {
    written.kept += 1;
    continue;
  }
  const ext = path.extname(rel).toLowerCase();
  const { width, height } = await sharp(fs.readFileSync(file)).metadata();
  const image = sharp(Buffer.from(svgFor(width, height, path.basename(rel, ext), light)));
  if (ext === '.png') await image.png({ palette: true, compressionLevel: 9 }).toFile(file + '.tmp');
  else if (ext === '.webp') await image.webp({ quality: 80 }).toFile(file + '.tmp');
  else await image.jpeg({ quality: 80, mozjpeg: true }).toFile(file + '.tmp');
  fs.renameSync(file + '.tmp', file);
  written.placeholders += 1;
}

fs.copyFileSync(new URL('./README.prod.md', import.meta.url), path.join(out, 'README.md'));

console.log(`prod folder: ${out}`);
console.log(written);
