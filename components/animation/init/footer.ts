import gsap from 'gsap';
import { scrollToTarget } from '@/components/animation/lenis-instance';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  const footer = $('[data-footer]');
  const page = $('[data-page]');
  if (!footer || !page) return;

  const fitSticky = () => {
    footer.style.position = footer.offsetHeight > window.innerHeight - 40 ? 'relative' : '';
  };
  fitSticky();
  window.addEventListener('resize', fitSticky);

  $('[data-back-top]', footer)?.addEventListener('click', () => scrollToTarget(0));

  if (!motionEnabled()) return;

  const ring = $('[data-back-top-ring]', footer);
  if (ring) {
    gsap.to(ring, {
      attr: { 'stroke-dashoffset': 0 },
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    });
  }

  const inner = $('[data-footer-inner]', footer);
  const cells = $$('[data-footer-cell]', footer);
  gsap
    .timeline({
      scrollTrigger: {
        trigger: page,
        start: 'bottom bottom',
        end: () => `bottom ${window.innerHeight - footer.offsetHeight}px`,
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(inner, { yPercent: 14, opacity: 0.2 }, { yPercent: 0, opacity: 1, ease: 'none', duration: 0.7 }, 0)
    .fromTo(cells, { yPercent: 100 }, { yPercent: 0, ease: 'power3.out', duration: 0.5, stagger: 0.07 }, 0.3);

  cells.forEach((cell) => {
    const letter = $('[data-footer-letter]', cell);
    const alt = $('[data-footer-alt]', cell);
    if (!letter || !alt) return;
    gsap.set(alt, { y: 0, yPercent: 105 });
    let back: gsap.core.Tween | null = null;
    const roll = (on: boolean) => {
      gsap.to(letter, { yPercent: on ? -105 : 0, duration: on ? 0.55 : 0.75, ease: 'expo.out', overwrite: true });
      gsap.to(alt, { yPercent: on ? 0 : 105, duration: on ? 0.55 : 0.75, ease: 'expo.out', overwrite: true });
    };
    cell.addEventListener('pointerenter', () => {
      back?.kill();
      roll(true);
    });
    cell.addEventListener('pointerleave', () => {
      back = gsap.delayedCall(0.22, () => roll(false));
    });
    cell.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse') return;
      roll(true);
      back?.kill();
      back = gsap.delayedCall(0.6, () => roll(false));
    });
  });
}
