import gsap from 'gsap';
import { scrollToTarget } from '@/components/animation/lenis-instance';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, finePointer, motionEnabled } from '@/utils/dom';

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

  const word = $('[data-footer-word]', footer);
  if (!word) return;
  const letters = $$('[data-footer-letter]', word);

  gsap.set(letters, { opacity: 0, y: 46 });
  ScrollTrigger.create({
    trigger: word,
    start: 'top 95%',
    once: true,
    onEnter: () =>
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        duration: 0.62,
        ease: 'power3.out',
        stagger: 0.04,
        onComplete: () => wave(word, letters),
      }),
  });
}

const wave = (word: HTMLElement, letters: HTMLElement[]) => {
  if (!finePointer()) return;
  const lift = letters.map(() => 0);
  const pointer = { x: 0, y: 0, inside: false };
  let centers: { x: number; y: number }[] = [];
  let frame = 0;

  const measure = () => {
    centers = letters.map((letter) => ({
      x: letter.offsetLeft + letter.offsetWidth / 2,
      y: letter.offsetTop + letter.offsetHeight / 2,
    }));
  };

  const step = () => {
    frame = 0;
    if (!centers.length) measure();
    const size = parseFloat(getComputedStyle(word).fontSize) || 120;
    const maxLift = Math.min(70, size * 0.18);
    const radius = size * 1.9 + 170;
    const box = word.getBoundingClientRect();
    let moving = false;

    letters.forEach((letter, i) => {
      const dx = pointer.x - (box.left + centers[i].x);
      const dy = pointer.y - (box.top + centers[i].y);
      let t = pointer.inside ? Math.max(0, 1 - Math.hypot(dx, dy) / radius) : 0;
      t = t * t * (3 - 2 * t);
      const target = t * maxLift;
      lift[i] += (target - lift[i]) * 0.18;
      if (Math.abs(target - lift[i]) > 0.06) moving = true;
      const tilt = (dx > 0 ? -1 : 1) * (maxLift ? lift[i] / maxLift : 0) * 4.5;
      letter.style.transform = `translate3d(0, ${(-lift[i]).toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    });

    if (moving || pointer.inside) frame = requestAnimationFrame(step);
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(step);
  };

  word.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.inside = true;
    wake();
  });
  word.addEventListener('pointerleave', () => {
    pointer.inside = false;
    wake();
  });
  window.addEventListener('resize', () => {
    centers = [];
  });
};
