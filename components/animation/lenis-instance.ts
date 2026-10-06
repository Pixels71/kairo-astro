import type Lenis from 'lenis';

let instance: Lenis | undefined;

export const setLenis = (lenis: Lenis) => {
  instance = lenis;
};

export const getLenis = () => instance;

export const scrollToTarget = (target: string | number | HTMLElement, immediate = false) => {
  const lenis = getLenis();
  const offset = typeof target === 'number' ? 0 : -96;
  if (lenis) {
    lenis.scrollTo(target, { offset, immediate, duration: 1.4 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }
  const element = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return;
  window.scrollTo({
    top: element.getBoundingClientRect().top + window.scrollY + offset,
    behavior: immediate ? 'auto' : 'smooth',
  });
};
