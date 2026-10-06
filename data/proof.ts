import type { Stat, Testimonial } from '@/interface';

export const testimonials: Testimonial[] = [
  {
    quote:
      'We used to hear about churn in the quarterly review. Now Kairo flags it in week two, while the account is still saveable.',
    name: 'Ines Okafor',
    role: 'VP Customer Success',
    company: 'Ledgerly',
    image: '/images/portrait-ines.jpg',
  },
  {
    quote:
      'It caught a pricing bug on a Sunday night that would have cost us the whole month. Nobody was even looking at that chart.',
    name: 'Tobi Mensah',
    role: 'Head of Revenue Operations',
    company: 'Halden Freight',
    image: '/images/portrait-tobi.jpg',
  },
  {
    quote:
      'My Monday starts with one brief instead of nine dashboards. It reads like a sharp analyst wrote it overnight.',
    name: 'Maren Holt',
    role: 'Chief Operating Officer',
    company: 'Mirelab',
    image: '/images/portrait-maren.jpg',
  },
];

export const stats: Stat[] = [
  { value: 3.4, decimals: 1, suffix: 'x', label: 'faster response to incidents' },
  { value: 41, suffix: '%', label: 'fewer customer escalations' },
  { value: 11, suffix: 'h', label: 'saved per team lead each week' },
];
