import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToTarget } from '@/components/animation/lenis-instance';
import { $, $$, finePointer, motionEnabled } from '@/utils/dom';

const spotlight = (mark: HTMLElement) => {
  const spot = $('[data-footer-spot]', mark);
  if (!spot) return;
  const words = $$('[data-footer-word]', mark);
  const columns = words.map((word) => $$('[data-footer-letter]', word));
  const state = { x: 0, y: 0, r: 0 };
  const apply = () => {
    spot.style.setProperty('--mx', `${state.x}px`);
    spot.style.setProperty('--my', `${state.y}px`);
    spot.style.setProperty('--mr', `${state.r}px`);
  };
  const xTo = gsap.quickTo(state, 'x', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
  const yTo = gsap.quickTo(state, 'y', { duration: 0.6, ease: 'power3.out', onUpdate: apply });
  const radius = () => Math.max(140, window.innerWidth * 0.17);

  const lifts = columns[0].map((_, i) =>
    columns.map((letters) => ({
      y: gsap.quickTo(letters[i], 'yPercent', { duration: 0.9, ease: 'elastic.out(1, 0.45)' }),
      s: gsap.quickTo(letters[i], 'scaleY', { duration: 0.9, ease: 'elastic.out(1, 0.45)' }),
    })),
  );

  const lift = (clientX: number) => {
    columns[0].forEach((letter, i) => {
      const box = letter.getBoundingClientRect();
      const distance = Math.abs(clientX - (box.left + box.width / 2));
      const amount = Math.max(0, 1 - distance / (box.width * 1.4));
      lifts[i].forEach((pair) => {
        pair.y(-amount * 12);
        pair.s(1 + amount * 0.1);
      });
    });
  };

  if (finePointer()) {
    mark.addEventListener('pointerenter', (event) => {
      const box = mark.getBoundingClientRect();
      state.x = event.clientX - box.left;
      state.y = event.clientY - box.top;
      gsap.to(state, { r: radius(), duration: 0.8, ease: 'expo.out', onUpdate: apply });
    });
    mark.addEventListener('pointermove', (event) => {
      const box = mark.getBoundingClientRect();
      xTo(event.clientX - box.left);
      yTo(event.clientY - box.top);
      lift(event.clientX);
    });
    mark.addEventListener('pointerleave', () => {
      gsap.to(state, { r: 0, duration: 0.7, ease: 'power3.inOut', onUpdate: apply });
      lifts.forEach((pairs) => pairs.forEach((pair) => (pair.y(0), pair.s(1))));
    });
    return;
  }

  const drift = gsap
    .timeline({ repeat: -1, yoyo: true, paused: true, onUpdate: apply })
    .fromTo(
      state,
      { x: () => mark.offsetWidth * 0.1, y: () => mark.offsetHeight * 0.4, r: () => radius() * 0.9 },
      { x: () => mark.offsetWidth * 0.9, y: () => mark.offsetHeight * 0.6, duration: 4.5, ease: 'sine.inOut' },
    );
  ScrollTrigger.create({
    trigger: mark,
    start: 'top bottom',
    onToggle: (self) => (self.isActive ? drift.play() : drift.pause()),
  });
};

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
  const words = $$('[data-footer-word]', footer);
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
    .fromTo(words, { yPercent: 100 }, { yPercent: 0, ease: 'power2.out', duration: 0.6 }, 0.25);

  const mark = $('[data-footer-mark]', footer);
  if (mark) spotlight(mark);
}
