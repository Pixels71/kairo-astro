import { site } from '@/data/site';
import type { FooterGroup } from '@/interface';

export const footerGroups: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/#how' },
      { label: 'Capabilities', href: '/#capabilities' },
      { label: 'Pricing', href: '/pricing' },
      { label: site.cta.secondary.label, href: site.cta.secondary.href },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Customers', href: '/customers' },
      { label: 'Journal', href: '/journal' },
      { label: 'Careers', href: '/about#roles' },
    ],
  },
];

export const footerCopy = {
  newsletter: {
    title: 'One short email a week on acting before it is too late.',
    label: 'Work email',
    placeholder: 'you@company.com',
    note: 'No spam. Unsubscribe in one click.',
    loading: 'Subscribing...',
    success: 'You are in. The first issue lands on Friday.',
    error: 'That email looks incomplete. Try name@company.com.',
  },
  followTitle: 'Follow',
  backToTop: 'Back to top',
  legal: `© ${new Date().getFullYear()} ${site.legalName}`,
};
