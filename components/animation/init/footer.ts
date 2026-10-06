import gsap from 'gsap';
import { scrollToTarget } from '@/components/animation/lenis-instance';
import { $, motionEnabled } from '@/utils/dom';

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
    .fromTo(inner, { yPercent: 14, opacity: 0.2 }, { yPercent: 0, opacity: 1, ease: 'none', duration: 0.7 }, 0);
}
