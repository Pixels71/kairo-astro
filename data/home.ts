import { site } from '@/data/site';

export const hero = {
  lines: [{ text: 'Know the moment' }, { text: 'before it', accent: 'passes.' }],
  intro: `${site.name} reads your metrics, tickets and calls, then tells the right person what changed and why.`,
};

export const logosSection = {
  label: 'Trusted by teams who would rather hear it first',
};

export const manifesto = {
  eyebrow: `Why ${site.name}`,
  parts: [
    { text: 'Your company already knows what is about to go wrong.' },
    { image: '/images/manifesto-face.jpg' },
    { text: 'It is buried in a dashboard nobody opened, a ticket marked low,' },
    { image: '/images/manifesto-city.jpg' },
    { text: `a call that ended early. ${site.name} listens to all of it` },
    { image: '/images/manifesto-hand.jpg' },
    { text: 'and tells you while there is still time to act.' },
  ] as ({ text: string } | { image: string })[],
  hint: 'Drag across the line, or tap it',
};

export const productStory = {
  title: ['Signal,', 'not noise.'],
  heroImage: '/images/journal-face.jpg',
  tiles: [
    'gallery-corridor',
    'journal-noise',
    'gallery-street',
    'manifesto-city',
    'gallery-desk',
    'journal-light',
    'gallery-tower',
    'product-reveal',
    'journal-blur',
    'gallery-road',
    'capability-lights',
    'journal-swirl',
    'about-city',
    'gallery-window',
  ].map((name) => `/images/${name}.jpg`),
  acts: [
    {
      tab: 'Collect',
      title: 'Every signal, in one place.',
      body: 'Metrics, tickets, calls and docs stream in from the tools your team already uses.',
      count: 12480,
      unit: 'signals today',
    },
    {
      tab: 'Filter',
      title: 'The noise, filtered out.',
      body: `${site.name} knows what normal looks like for each number, so routine movement stays quiet.`,
      count: 37,
      unit: 'real changes',
    },
    {
      tab: 'Flag',
      title: 'The moment, flagged.',
      body: 'One change worth acting on, sent to the person who owns it, with the cause attached.',
      count: 1,
      unit: 'brief sent',
    },
  ],
};

export const capabilities = {
  title: 'Everything it takes to act first.',
  detect: {
    title: 'Spots the shift',
    body: `Every metric gets its own normal range. ${site.name} flags what breaks it, with the likely cause.`,
    label: 'Checkout errors 3x',
  },
  connect: {
    title: 'Plugs into your stack',
    body: 'Billing, CRM, support, product analytics and your warehouse. Read-only, connected in minutes.',
    image: '/images/capability-lights.jpg',
  },
  rank: {
    title: 'Ranks by impact',
    body: 'Changes are sorted by what they cost, so the biggest one is always on top.',
    items: [
      { title: 'Enterprise renewals slipping', value: '$48k at risk' },
      { title: 'Checkout errors in Germany', value: '212 orders' },
      { title: 'Onboarding drop-off on step 3', value: '-9% this week' },
    ],
  },
  brief: {
    title: 'Writes the brief',
    body: 'One short message with the cause, the size and an owner. Sent where that person works.',
    text: 'Checkout errors in Germany tripled after Tuesday’s release. 212 orders failed. Likely cause: the new address check. Suggested owner: Payments.',
  },
  privacy: {
    title: 'Private by default',
    body: 'SSO, audit logs and field-level redaction. Your data never trains shared models.',
  },
};

export const howItWorks = {
  title: 'Up and running in an afternoon.',
  watchHint: 'Drag the line',
};

export const storiesSection = {
  title: 'Teams that saw it coming.',
  body: `Freight networks, labs and payment companies use ${site.name} to hear about problems while they are still small.`,
  cta: { label: 'All customer stories', href: '/customers' },
};

export const proofSection = {
  title: 'In their own words.',
};

export const closingCta = {
  title: 'Catch the next one before it lands.',
  body: 'Connect your first source in twenty minutes. Free for small teams, no card needed.',
};
