export interface NavLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'x' | 'linkedin' | 'github';
}

export interface Step {
  verb: string;
  tag: string;
  visual: 'connect' | 'watch' | 'brief';
  title: string;
  body: string;
  points: string[];
  image: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  image: string;
  metric: { value: number; prefix?: string; suffix?: string; label: string };
}

export interface Plan {
  name: string;
  monthly: number;
  yearly: number;
  description: string;
  cta: string;
  href: string;
  featured?: boolean;
  features: string[];
}

export interface CompareGroup {
  title: string;
  rows: { feature: string; values: (string | boolean)[] }[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface Value {
  title: string;
  body: string;
}

export interface Milestone {
  year: string;
  title: string;
  body: string;
  image: string;
}

export interface Role {
  title: string;
  team: string;
  location: string;
}

export interface Moment {
  client: string;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  image: string;
  alt: string;
}
