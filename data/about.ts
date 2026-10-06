import type { Milestone, Role, TeamMember, Value } from '@/interface';

export const milestones: Milestone[] = [
  {
    year: '2021',
    title: 'A spreadsheet of missed moments',
    body: 'Our founders listed every problem their last company found out about too late. The list had 214 rows.',
    image: '/images/about-city.jpg',
  },
  {
    year: '2022',
    title: 'The first brief',
    body: 'Twelve design partners. One Slack message every morning, written by a model and checked by a person.',
    image: '/images/gallery-desk.jpg',
  },
  {
    year: '2024',
    title: 'From reports to signals',
    body: 'We stopped summarising dashboards and started watching the data underneath them, in real time.',
    image: '/images/about-studio.jpg',
  },
  {
    year: '2026',
    title: 'Teams on four continents',
    body: 'Freight, energy, health and finance operators now start their day with a Kairo brief.',
    image: '/images/gallery-tower.jpg',
  },
];

export const values: Value[] = [
  {
    title: 'Early beats perfect',
    body: 'A rough signal on Tuesday is worth more than a polished report on Friday. We ship the useful version first.',
  },
  {
    title: 'Quiet by default',
    body: 'Every alert costs someone their focus. Kairo stays silent unless it has something worth saying.',
  },
  {
    title: 'Show the evidence',
    body: 'No claim without a link to the data behind it. Trust is earned one checkable sentence at a time.',
  },
  {
    title: 'Operators first',
    body: 'We build for the people who act on the numbers, not the people who admire them.',
  },
];

export const team: TeamMember[] = [
  { name: 'Amara Diallo', role: 'Co-founder, CEO', image: '/images/team-amara.jpg' },
  { name: 'Jonas Weber', role: 'Co-founder, CTO', image: '/images/team-jonas.jpg' },
  { name: 'Lin Takahashi', role: 'Head of Design', image: '/images/team-lin.jpg' },
  { name: 'Rafael Costa', role: 'Head of Machine Learning', image: '/images/team-rafael.jpg' },
  { name: 'Sade Adeyemi', role: 'Head of Customer Success', image: '/images/team-sade.jpg' },
  { name: 'Viktor Lind', role: 'Chair, Board of Directors', image: '/images/team-viktor.jpg' },
];

export const roles: Role[] = [
  { title: 'Senior Product Engineer', team: 'Engineering', location: 'Remote, Europe' },
  { title: 'Machine Learning Engineer', team: 'Signals', location: 'Berlin or remote' },
  { title: 'Product Designer', team: 'Design', location: 'Remote, Americas' },
  { title: 'Customer Success Lead', team: 'Customers', location: 'London' },
];
