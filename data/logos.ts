import type { Integration, PartnerLogo } from '@/interface';

export const customerLogos: PartnerLogo[] = [
  { name: 'Lumen', shape: 'orbit' },
  { name: 'Halcyon', shape: 'wave' },
  { name: 'Quarry', shape: 'prism' },
  { name: 'Meridian', shape: 'split' },
  { name: 'Arcwell', shape: 'loop' },
  { name: 'Tessel', shape: 'grid' },
  { name: 'Brightline', shape: 'spark' },
  { name: 'Oakfield', shape: 'stack' },
  { name: 'Vantage', shape: 'frame' },
];

export const integrations: Integration[] = [
  { label: 'Billing', icon: 'credit-card' },
  { label: 'CRM', icon: 'kanban' },
  { label: 'Support desk', icon: 'lifebuoy' },
  { label: 'Data warehouse', icon: 'database' },
  { label: 'Product analytics', icon: 'chart' },
  { label: 'Team chat', icon: 'chat' },
  { label: 'Call recordings', icon: 'phone' },
  { label: 'Email', icon: 'email' },
  { label: 'Cloud storage', icon: 'cloud' },
];
