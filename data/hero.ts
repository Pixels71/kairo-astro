import type { Moment } from '@/interface';

export const moments: Moment[] = [
  {
    client: 'Halden Freight',
    label: 'fewer stockouts',
    value: 34,
    suffix: '%',
    image: '/images/story-halden.jpg',
    alt: 'A long, brightly lit warehouse aisle at night',
  },
  {
    client: 'Solvane Energy',
    label: 'earlier fault warnings',
    value: 7,
    suffix: ' days',
    image: '/images/story-solvane.jpg',
    alt: 'A field engineer walking past solar panels at sunset',
  },
  {
    client: 'Mirelab',
    label: 'faster sample turnaround',
    value: 19,
    suffix: '%',
    image: '/images/story-mirelab.jpg',
    alt: 'Two lab technicians in white coats crossing a red-lit room',
  },
  {
    client: 'Aerowin',
    label: 'fewer ground delays',
    value: 23,
    suffix: '%',
    image: '/images/story-aerowin.jpg',
    alt: 'An empty airport walkway striped with light and shadow',
  },
];

export const briefPortrait = {
  image: '/images/step-brief.jpg',
  alt: 'A person in the dark, face lit by a phone screen',
};
