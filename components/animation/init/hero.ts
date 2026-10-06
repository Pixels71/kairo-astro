import gsap from 'gsap';
import { onIntro } from '@/components/animation/intro';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  if (!motionEnabled()) return;
  const lines = $$('[data-hero-line] > *');
  if (lines.length) {
    onIntro(() => {
      gsap.to(lines, { y: 0, duration: 1.4, ease: 'expo.out', stagger: 0.11 });
    });
  }

  const hero = $('[data-hero]');
  const sink = $('[data-hero-sink]');
  if (hero && sink) {
    gsap.to(sink, {
      yPercent: 22,
      opacity: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}
