import type { FooterGroup, SocialLink } from '@/interface';

export const footerGroups: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '/#how' },
      { label: 'Capabilities', href: '/#capabilities' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Book a demo', href: '/pricing#sales' },
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

export const socialLinks: SocialLink[] = [
  { label: 'Kairo on X', href: 'https://x.com', icon: 'x' },
  { label: 'Kairo on LinkedIn', href: 'https://www.linkedin.com', icon: 'linkedin' },
  { label: 'Kairo on GitHub', href: 'https://github.com', icon: 'github' },
];
