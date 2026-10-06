import { site } from '@/data/site';
import type { Testimonial } from '@/interface';

export const testimonials: Testimonial[] = [
  {
    quote: `We used to hear about churn in the quarterly review. Now ${site.name} flags it in week two, while the account is still saveable.`,
    name: 'Ines Okafor',
    role: 'VP Customer Success',
    company: 'Ledgerly',
    image: '/images/portrait-ines.jpg',
    metric: { value: 12, prefix: '+', suffix: ' pts', label: 'net revenue retention' },
  },
  {
    quote:
      'It caught a pricing bug on a Sunday night that would have cost us the whole month. Nobody was even looking at that chart.',
    name: 'Tobi Mensah',
    role: 'Head of Revenue Operations',
    company: 'Halden Freight',
    image: '/images/story-halden.jpg',
    metric: { value: 34, suffix: '%', label: 'fewer stockouts' },
  },
  {
    quote:
      'My Monday starts with one brief instead of nine dashboards. It reads like a sharp analyst wrote it overnight.',
    name: 'Maren Holt',
    role: 'Chief Operating Officer',
    company: 'Mirelab',
    image: '/images/portrait-maren.jpg',
    metric: { value: 19, suffix: '%', label: 'faster sample turnaround' },
  },
  {
    quote: 'Our crews used to drive to sites that were fine. Now every visit starts with a reason and a part number.',
    name: 'Elif Arslan',
    role: 'Director of Field Operations',
    company: 'Solvane Energy',
    image: '/images/story-solvane.jpg',
    metric: { value: 28, suffix: '%', label: 'fewer wasted truck rolls' },
  },
  {
    quote: 'We see the bad afternoon coming at breakfast now. That is the whole difference.',
    name: 'Callum Reyes',
    role: 'Head of Ground Operations',
    company: 'Aerowin',
    image: '/images/portrait-tobi.jpg',
    metric: { value: 3, suffix: ' hrs', label: 'earlier view of staffing gaps' },
  },
  {
    quote: `Finance and engineering finally look at the same story. ${site.name} writes it for both of us.`,
    name: 'Noor Haddad',
    role: 'VP Finance',
    company: 'Corvid Cloud',
    image: '/images/story-corvid.jpg',
    metric: { value: 17, suffix: '%', label: 'lower spend per customer' },
  },
];
