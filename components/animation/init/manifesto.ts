import gsap from 'gsap';
import { $$, motionEnabled } from '@/utils/dom';

export default function init() {
  if (!motionEnabled()) return;
  $$('[data-words]').forEach((block) => {
    const tokens = $$('[data-word], [data-word-media]', block);
    gsap.set(block, { visibility: 'visible' });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: block, start: 'top 78%', end: 'bottom 42%', scrub: 0.6 },
    });
    tokens.forEach((token, i) => {
      if (token.hasAttribute('data-word-media')) {
        const image = token.querySelector('img');
        tl.fromTo(
          token,
          { clipPath: 'inset(0 50% 0 50%)' },
          { clipPath: 'inset(0 0% 0 0%)', duration: 1.2, ease: 'power2.out' },
          i * 0.12,
        );
        if (image) tl.fromTo(image, { scale: 1.5 }, { scale: 1, duration: 1.4, ease: 'power2.out' }, i * 0.12);
        return;
      }
      tl.fromTo(token, { opacity: 0.14 }, { opacity: 1, duration: 0.4, ease: 'none' }, i * 0.12);
    });
  });
}
