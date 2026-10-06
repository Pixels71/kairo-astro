import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('/assets/images/**/*.{png,jpg,jpeg,webp,svg,avif}', {
  eager: true,
});

export const resolveImage = (src: string | ImageMetadata): ImageMetadata => {
  if (typeof src !== 'string') return src;
  const key = `/assets${src.startsWith('/') ? src : `/${src}`}`;
  const found = images[key];
  if (!found) throw new Error(`Image not found in assets: ${src}`);
  return found.default;
};
