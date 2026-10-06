import type { NavLink } from '@/interface';

export const navLinks: NavLink[] = [
  { label: 'Customers', href: '/customers' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
];

export const menuLinks: NavLink[] = [{ label: 'Home', href: '/' }, ...navLinks];

export const routeLabels: Record<string, string> = {
  '/': 'Home',
  '/customers': 'Customers',
  '/pricing': 'Pricing',
  '/journal': 'Journal',
  '/about': 'About',
};
