import gsap from 'gsap';
import { getLenis } from '@/components/animation/lenis-instance';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  if (!motionEnabled()) return;
  $$('[data-marquee]').forEach((marquee) => {
    const track = $('[data-marquee-track]', marquee);
    if (!track) return;
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    let direction = 1;
    let hovering = false;

    const settle = (boost = 0) => {
      const speed = hovering ? 0.25 : 1 + boost;
      gsap.to(loop, { timeScale: speed * direction, duration: 0.8, ease: 'power3.out', overwrite: true });
    };

    getLenis()?.on('scroll', ({ velocity, direction: dir }: { velocity: number; direction: number }) => {
      if (dir) direction = dir;
      settle(Math.min(Math.abs(velocity) * 0.12, 5));
    });

    marquee.addEventListener('mouseenter', () => {
      hovering = true;
      settle();
    });
    marquee.addEventListener('mouseleave', () => {
      hovering = false;
      settle();
    });
  });
}
