let release: () => void = () => {};

const introDone = new Promise<void>((resolve) => {
  release = resolve;
});

export const onIntro = (callback: () => void) => {
  introDone.then(callback);
};

export const releaseIntro = () => release();
