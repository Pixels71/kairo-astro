import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import { site } from './data/site';

export default defineConfig({
  srcDir: './',
  site: site.url,
  vite: { plugins: [tailwindcss()], optimizeDeps: { include: ['number-flow'] } },
  image: { responsiveStyles: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: 'Cabinet Grotesk',
      cssVariable: '--font-display-face',
      weights: [500, 700, 800],
      styles: ['normal'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontshare(),
      name: 'General Sans',
      cssVariable: '--font-body-face',
      weights: [400, 500, 600],
      styles: ['normal'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono-face',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
  ],
});
