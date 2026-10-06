import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.cwd();

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, '').split('=');
    return [k, v.length ? v.join('=') : 'true'];
  }),
);

const out = path.resolve(root, args.out ?? 'public/images/og-image.jpg');
if (fs.existsSync(out) && !args.force) {
  console.log(`${path.relative(root, out)} already exists (use --force to regenerate)`);
  process.exit(0);
}

const values = {
  DARK: args.dark ?? '#04151f',
  DARK_TOP: args.darkTop ?? '#061422',
  ACCENT: args.accent ?? '#a7e2ff',
  ACCENT_GLOW: args.accentGlow ?? 'rgba(167, 226, 255, 0.55)',
  MUTED_GLOW: args.mutedGlow ?? 'rgba(107, 142, 172, 0.55)',
  LOGO: pathToFileURL(path.resolve(root, args.logo ?? 'public/images/logo.svg')).href,
  EYEBROW: args.eyebrow ?? '// INSTITUTIONAL ASSET MANAGEMENT',
  TITLE: args.title ?? 'Governing complexity',
  TITLE_ITALIC: args.italic ?? 'engineered for scale',
  TAGLINE: args.tagline ?? 'Operational frameworks · Capital deployment · Cross-border compliance',
  CTA: args.cta ?? 'Review capabilities',
};

const html = fs
  .readFileSync(path.join(here, 'og-template.html'), 'utf8')
  .replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? '');

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);
const chrome = candidates.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error('No Chrome/Edge found. Set CHROME_PATH to a Chromium-based browser.');
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'));
const page = path.join(tmp, 'og.html');
const png = path.join(tmp, 'og.png');
fs.writeFileSync(page, html);

try {
  execFileSync(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=8000',
      '--allow-file-access-from-files',
      `--screenshot=${png}`,
      pathToFileURL(page).href,
    ],
    { stdio: 'ignore' },
  );
} catch {}

if (!fs.existsSync(png)) {
  console.error('Chrome did not produce a screenshot.');
  process.exit(1);
}

const { default: sharp } = await import('sharp');
fs.mkdirSync(path.dirname(out), { recursive: true });
const info = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`wrote ${path.relative(root, out)} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
