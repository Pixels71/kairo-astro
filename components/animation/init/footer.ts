import gsap from 'gsap';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
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

  const letters = $$('[data-footer-letter]', footer);
  const inner = $('[data-footer-inner]', footer);
  const range = {
    trigger: page,
    start: 'bottom bottom',
    end: () => `bottom ${window.innerHeight - footer.offsetHeight}px`,
    scrub: true,
    invalidateOnRefresh: true,
  } satisfies ScrollTrigger.Vars;

  gsap
    .timeline({ scrollTrigger: range })
    .fromTo(inner, { yPercent: 18, opacity: 0.2 }, { yPercent: 0, opacity: 1, ease: 'none', duration: 0.7 }, 0)
    .fromTo(letters, { yPercent: 105 }, { yPercent: 0, ease: 'power2.out', duration: 0.5, stagger: 0.06 }, 0.3);
}
