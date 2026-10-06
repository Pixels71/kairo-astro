import gsap from 'gsap';
import { $, $$, finePointer, motionEnabled } from '@/utils/dom';

export default function init() {
  const chip = $('[data-view-chip]');
  const inner = $('[data-view-chip-inner]');
  const text = $('[data-view-chip-text]');
  const targets = $$('[data-chip]');
  if (!chip || !inner || !text || !targets.length || !finePointer() || !motionEnabled()) return;

  gsap.set(inner, { xPercent: -50, yPercent: -50, scale: 0 });
  const xTo = gsap.quickTo(chip, 'x', { duration: 0.55, ease: 'power3.out' });
  const yTo = gsap.quickTo(chip, 'y', { duration: 0.55, ease: 'power3.out' });

  window.addEventListener('mousemove', (event) => {
    xTo(event.clientX);
    yTo(event.clientY);
  });

  targets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      text.textContent = target.dataset.chip || 'View';
      gsap.to(inner, { scale: 1, duration: 0.6, ease: 'expo.out' });
    });
    target.addEventListener('mouseleave', () => gsap.to(inner, { scale: 0, duration: 0.45, ease: 'power3.out' }));
  });

  document.addEventListener('kairo:navigate', () => gsap.to(inner, { scale: 0, duration: 0.3 }));
}
