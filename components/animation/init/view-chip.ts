import gsap from 'gsap';
import { getLenis } from '@/components/animation/lenis-instance';
import { $, finePointer, motionEnabled } from '@/utils/dom';

export default function init() {
  const chip = $('[data-view-chip]');
  const inner = $('[data-view-chip-inner]');
  const text = $('[data-view-chip-text]');
  if (!chip || !inner || !text || !document.querySelector('[data-chip]') || !finePointer() || !motionEnabled()) return;

  gsap.set(inner, { xPercent: -50, yPercent: -50, scale: 0 });
  const xTo = gsap.quickTo(chip, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(chip, 'y', { duration: 0.35, ease: 'power3.out' });
  const pointer = { x: -1, y: -1 };
  let current: HTMLElement | null = null;

  const update = () => {
    if (pointer.x < 0) return;
    const hit = document.elementFromPoint(pointer.x, pointer.y);
    const target = hit?.closest<HTMLElement>('[data-chip]') ?? null;
    if (target === current) return;
    current = target;
    if (target) {
      text.textContent = target.dataset.chip || 'View';
      gsap.to(inner, { scale: 1, duration: 0.5, ease: 'expo.out', overwrite: true });
    } else {
      gsap.to(inner, { scale: 0, duration: 0.35, ease: 'power3.out', overwrite: true });
    }
  };

  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    xTo(event.clientX);
    yTo(event.clientY);
    update();
  });
  document.documentElement.addEventListener('pointerleave', () => {
    pointer.x = -1;
    current = null;
    gsap.to(inner, { scale: 0, duration: 0.3, overwrite: true });
  });

  const lenis = getLenis();
  if (lenis) lenis.on('scroll', update);
  else window.addEventListener('scroll', update, { passive: true });

  document.addEventListener('kairo:navigate', () => {
    current = null;
    gsap.to(inner, { scale: 0, duration: 0.3, overwrite: true });
  });
}
