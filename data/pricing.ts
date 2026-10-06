import { site } from '@/data/site';
import type { CompareGroup, Faq, Plan } from '@/interface';

export const plans: Plan[] = [
  {
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    description: 'For a founder or a small team watching a handful of numbers.',
    cta: site.cta.primary.label,
    href: site.cta.primary.href,
    features: ['5 connected sources', '25 tracked metrics', 'Weekly digest by email', '7 days of history'],
  },
  {
    name: 'Growth',
    monthly: 79,
    yearly: 63,
    description: 'For teams that want to hear about problems the day they start.',
    cta: site.cta.primary.label,
    href: site.cta.primary.href,
    featured: true,
    features: [
      'Unlimited sources',
      '500 tracked metrics',
      'Real-time briefs in Slack',
      'Call and ticket analysis',
      '12 months of history',
    ],
  },
  {
    name: 'Scale',
    monthly: 249,
    yearly: 199,
    description: 'For operators running several teams, regions or product lines.',
    cta: site.cta.secondary.label,
    href: site.cta.secondary.href,
    features: [
      'Everything in Growth',
      'Unlimited metrics',
      'SSO and audit log',
      'Custom data retention',
      'A named analyst',
    ],
  },
];

export const compareGroups: CompareGroup[] = [
  {
    title: 'Signals',
    rows: [
      { feature: 'Connected sources', values: ['5', 'Unlimited', 'Unlimited'] },
      { feature: 'Tracked metrics', values: ['25', '500', 'Unlimited'] },
      { feature: 'Anomaly detection', values: [true, true, true] },
      { feature: 'Call and ticket analysis', values: [false, true, true] },
    ],
  },
  {
    title: 'Briefs',
    rows: [
      { feature: 'Weekly digest', values: [true, true, true] },
      { feature: 'Real-time briefs', values: [false, true, true] },
      { feature: 'Follow-up questions', values: [false, true, true] },
      { feature: 'Custom brief templates', values: [false, false, true] },
    ],
  },
  {
    title: 'Security and admin',
    rows: [
      { feature: 'Role-based access', values: [false, true, true] },
      { feature: 'SSO and SCIM', values: [false, false, true] },
      { feature: 'Audit log', values: [false, false, true] },
      { feature: 'Data residency', values: [false, false, true] },
    ],
  },
];

export const faqs: Faq[] = [
  {
    question: 'How long does setup take?',
    answer: `Most teams connect their first sources in under twenty minutes. ${site.name} needs about a week of history to learn your baselines, and it backfills that from your existing data.`,
  },
  {
    question: `Does ${site.name} train on our data?`,
    answer:
      'No. Your data is used only to build your own baselines and briefs. It is never used to train shared models, and you can delete it at any time.',
  },
  {
    question: 'What counts as a tracked metric?',
    answer: `Any number ${site.name} watches over time: a revenue line, a queue length, a conversion rate, an account health score. Breakdowns of a metric by region or plan count once.`,
  },
  {
    question: 'Can we change plans later?',
    answer:
      'Yes. Upgrades apply straight away and are prorated. Downgrades take effect at the end of the billing period.',
  },
  {
    question: 'Where do briefs show up?',
    answer: `In Slack, Microsoft Teams, email or the ${site.name} app. Each person picks where they want to hear about the things they own.`,
  },
  {
    question: 'Do you offer discounts for startups?',
    answer:
      'Companies under two years old with less than five million in funding get Growth at half price for the first year. Ask us through the form below.',
  },
];
