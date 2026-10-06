import type { SiteConfig } from '@/interface';

export const site: SiteConfig = {
  name: 'Kairo',
  legalName: 'Kairo Labs, Inc.',
  url: 'https://kairo-astro.pixels71.workers.dev',
  title: 'Kairo - Know the moment before it passes',
  description:
    'Kairo reads your metrics, tickets and calls, then tells your team what changed, why it matters and who should act.',
  email: 'hello@kairo.app',
  careersEmail: 'careers@kairo.app',
  accent: '#ff5b1f',
  cta: {
    primary: { label: 'Start free', href: '/pricing#sales' },
    secondary: { label: 'Book a demo', href: '/pricing?intent=demo#sales' },
  },
  socials: [
    { label: 'X', href: 'https://x.com', icon: 'x' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: 'linkedin' },
    { label: 'GitHub', href: 'https://github.com', icon: 'github' },
  ],
};
