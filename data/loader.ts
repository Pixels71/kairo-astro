export const loader = {
  modules: [
    { label: 'Metrics', count: 1284 },
    { label: 'Tickets', count: 312 },
    { label: 'Calls', count: 46 },
    { label: 'Docs', count: 2051 },
  ],
  status: { waiting: 'Waiting', syncing: 'Syncing', live: 'Live' },
  caption: { loading: 'Calibrating baselines', done: 'Signal locked' },
  frames: [
    'story-halden',
    'manifesto-face',
    'story-solvane',
    'gallery-street',
    'story-mirelab',
    'journal-face',
    'story-aerowin',
    'manifesto-city',
  ].map((name) => `/images/${name}.jpg`),
};
