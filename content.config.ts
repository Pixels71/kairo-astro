import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const customers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './data/customers' }),
  schema: z.object({
    order: z.number(),
    client: z.string(),
    industry: z.string(),
    title: z.string(),
    summary: z.string(),
    cover: z.string(),
    gallery: z.array(z.string()).length(2),
    year: z.string(),
    team: z.string(),
    results: z.array(z.object({ value: z.string(), label: z.string() })).length(3),
    quote: z.object({ text: z.string(), name: z.string(), role: z.string() }),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './data/journal' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    date: z.string(),
    readTime: z.string(),
    cover: z.string(),
    author: z.object({ name: z.string(), role: z.string(), image: z.string() }),
    featured: z.boolean().optional(),
  }),
});

export const collections = { customers, journal };
