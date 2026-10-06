export const $ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  root.querySelector<T>(selector);

export const $$ = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(selector));

export const motionEnabled = () => document.documentElement.classList.contains('js');

export const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

export const fontsReady = () =>
  Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 1200))]);
