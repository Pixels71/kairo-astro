export const chars = (text: string) => Array.from(text);

export const words = (text: string) => text.split(/\s+/).filter(Boolean);

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
