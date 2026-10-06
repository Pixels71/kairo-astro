import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['hero', 'display', 'title', 'subtitle', 'lead', 'label'] }],
    },
  },
});

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));
