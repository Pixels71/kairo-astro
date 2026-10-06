import type { Step } from '@/interface';
import { site } from '@/data/site';

export const steps: Step[] = [
  {
    verb: 'Connect',
    tag: 'About 20 minutes',
    visual: 'connect',
    title: `Point ${site.name} at the tools you already use.`,
    body: 'Read-only connectors for your warehouse, CRM, billing, support and call recordings. Most teams are live before lunch.',
    points: [
      'One-click OAuth for most SaaS tools',
      'Warehouse sync for everything else',
      'Nothing to tag or instrument',
    ],
    image: '/images/step-connect.jpg',
  },
  {
    verb: 'Watch',
    tag: 'Your first week',
    visual: 'watch',
    title: 'It learns what normal looks like for you.',
    body: `${site.name} builds a baseline for every metric, account and queue, then watches for the changes that actually break the pattern.`,
    points: [
      'Seasonality and launches accounted for',
      'Thresholds you never have to set',
      'Quiet on the days nothing happens',
    ],
    image: '/images/step-watch.jpg',
  },
  {
    verb: 'Brief',
    tag: 'Every morning',
    visual: 'brief',
    title: 'The right person hears about it first.',
    body: `When something shifts, ${site.name} writes a short brief with the cause, the size of it and a suggested owner, then sends it where that person works.`,
    points: [
      'Slack, email or a weekly digest',
      'Evidence linked under every claim',
      'Follow-up questions in plain English',
    ],
    image: '/images/step-brief.jpg',
  },
];

export const briefPreview = {
  title: `${site.name} brief`,
  meta: 'For Payments, 7:02',
  priority: 'High',
  text: 'Checkout errors in Germany tripled after Tuesday’s release. 212 orders failed. Likely cause: the new address check.',
  actions: { secondary: 'See evidence', primary: 'Assign to Lena' },
};
