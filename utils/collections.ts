import { getCollection, type CollectionEntry } from 'astro:content';

export const getStories = async () => (await getCollection('customers')).sort((a, b) => a.data.order - b.data.order);

export const getPosts = async () =>
  (await getCollection('journal')).sort((a, b) => +new Date(b.data.date) - +new Date(a.data.date));

export type Story = CollectionEntry<'customers'>;
export type Post = CollectionEntry<'journal'>;
