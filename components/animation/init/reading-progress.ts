import gsap from 'gsap';
import { $, motionEnabled } from '@/utils/dom';

export default function init() {
  const bar = $('[data-reading-progress]');
  const body = $('[data-reading-body]');
  if (!bar || !body) return;
  if (!motionEnabled()) {
    bar.remove();
    return;
  }
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: body, start: 'top 60%', end: 'bottom 60%', scrub: 0.3 },
  });
}
