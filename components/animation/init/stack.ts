import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  const stack = $('[data-stack]');
  if (!stack || !motionEnabled()) return;
  const cards = $$('[data-stack-card]', stack);
  if (cards.length < 2) return;

  gsap.matchMedia().add('(min-width: 768px)', () => {
    const last = cards[cards.length - 1];
    cards.forEach((card, i) => {
      if (i === cards.length - 1) return;
      const inner = $('[data-stack-inner]', card);
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        endTrigger: last,
        end: 'top top',
        pin: true,
        pinSpacing: false,
      });
      gsap.to(inner, {
        scale: 0.9,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true },
      });
    });
  });
}
