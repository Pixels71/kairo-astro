import gsap from 'gsap';
import { $$, finePointer, motionEnabled } from '@/utils/dom';

export default function init() {
  if (!motionEnabled() || !finePointer()) return;

  for (const element of $$('[data-magnetic]')) {
    const strength = Number(element.dataset.magnetic) || 0.35;
    const inner = element.firstElementChild as HTMLElement | null;
    const xTo = gsap.quickTo(element, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(element, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const innerX = inner ? gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }) : null;
    const innerY = inner ? gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' }) : null;

    element.addEventListener('mousemove', (event) => {
      const box = element.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      innerX?.(dx * strength * 0.25);
      innerY?.(dy * strength * 0.25);
    });

    element.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
      innerX?.(0);
      innerY?.(0);
    });
  }
}
