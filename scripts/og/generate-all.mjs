import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.cwd();
const force = process.argv.includes('--force');

const siteSource = fs.readFileSync(path.join(root, 'data/site.ts'), 'utf8');
const siteValue = (key, fallback) => siteSource.match(new RegExp(`${key}:\\s*'([^']+)'`))?.[1] ?? fallback;
const brandName = siteValue('name', 'Brand');
const accent = siteValue('accent', '#ff5b1f');
const BRAND = brandName.toUpperCase();
const hex = accent.replace('#', '');
const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',');

const brand = {
  dark: '#0b0c0b',
  darkTop: '#141513',
  accent,
  accentGlow: `rgba(${rgb},0.22)`,
  mutedGlow: 'rgba(235,233,226,0.06)',
};

const frontmatter = (file) => {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const block = text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const read = (key) =>
    block
      .match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]
      .trim()
      .replace(/^'|'$/g, '');
  return { read };
};

const split = (title) => {
  const words = title.replace(/\.$/, '').split(' ');
  let best = 1;
  let gap = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ').length;
    const b = words.slice(i).join(' ').length;
    if (Math.abs(a - b) < gap) {
      gap = Math.abs(a - b);
      best = i;
    }
  }
  return [words.slice(0, best).join(' '), `${words.slice(best).join(' ')}.`];
};

const size = (lines) => {
  const longest = Math.max(...lines.map((line) => line.length));
  return `${Math.max(64, Math.min(104, Math.floor(1900 / longest)))}px`;
};

const jobs = [
  {
    out: 'og-image.jpg',
    eyebrow: `${BRAND} / SIGNAL INTELLIGENCE`,
    lines: ['Know the moment', 'before it passes.'],
    tagline: 'Metrics, tickets and calls, briefed in plain English',
    cta: 'Start free',
  },
  {
    out: 'og/customers.jpg',
    eyebrow: `${BRAND} / CUSTOMERS`,
    lines: ['Stories from teams', 'that moved first.'],
    tagline: 'Freight, energy, health, finance and mobility',
    cta: 'Read the stories',
  },
  {
    out: 'og/pricing.jpg',
    eyebrow: `${BRAND} / PRICING`,
    lines: ['Start free.', 'Pay when it pays off.'],
    tagline: 'Free for small teams. No card needed.',
    cta: 'See plans',
  },
  {
    out: 'og/journal.jpg',
    eyebrow: `${BRAND} / JOURNAL`,
    lines: ['Notes on', 'acting early.'],
    tagline: 'Operations, signal detection and writing briefs people read',
    cta: 'Read the journal',
  },
  {
    out: 'og/about.jpg',
    eyebrow: `${BRAND} / ABOUT`,
    lines: ['We build for the', 'minute before it matters.'],
    tagline: 'A remote-first team in Berlin and London',
    cta: 'Meet the team',
  },
];

for (const file of fs.readdirSync(path.join(root, 'data/customers'))) {
  const { read } = frontmatter(path.join(root, 'data/customers', file));
  jobs.push({
    out: `og/customers-${file.replace(/\.md$/, '')}.jpg`,
    eyebrow: `${BRAND} / CUSTOMER STORY / ${read('client').toUpperCase()}`,
    lines: split(read('title')),
    tagline: read('summary'),
    cta: 'Read the story',
  });
}

for (const file of fs.readdirSync(path.join(root, 'data/journal'))) {
  const { read } = frontmatter(path.join(root, 'data/journal', file));
  jobs.push({
    out: `og/journal-${file.replace(/\.md$/, '')}.jpg`,
    eyebrow: `${BRAND} / JOURNAL / ${read('category').toUpperCase()}`,
    lines: split(read('title')),
    tagline: read('readTime'),
    cta: 'Read the article',
  });
}

for (const job of jobs) {
  const out = path.join('public/images', job.out);
  if (fs.existsSync(path.join(root, out)) && !force) continue;
  execFileSync(
    process.execPath,
    [
      path.join(here, 'generate-og.mjs'),
      '--force',
      `--out=${out}`,
      `--eyebrow=${job.eyebrow}`,
      `--title=${job.lines[0]}`,
      `--italic=${job.lines[1]}`,
      `--size=${size(job.lines)}`,
      `--tagline=${job.tagline}`,
      `--cta=${job.cta}`,
      `--dark=${brand.dark}`,
      `--darkTop=${brand.darkTop}`,
      `--accent=${brand.accent}`,
      `--accentGlow=${brand.accentGlow}`,
      `--mutedGlow=${brand.mutedGlow}`,
    ],
    { stdio: 'inherit', env: { ...process.env, MSYS_NO_PATHCONV: '1' } },
  );
}
