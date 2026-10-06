import { site } from '@/data/site';

export const SITE_NAME = site.name;
export const DEFAULT_TITLE = site.title;
export const DEFAULT_DESCRIPTION = site.description;
export const pageTitle = (name: string) => `${name} - ${site.name}`;
