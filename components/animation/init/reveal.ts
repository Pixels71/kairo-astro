import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onIntro } from '@/components/animation/intro';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  if (!motionEnabled()) return;

  onIntro(() => {
    const intro = $$('[data-intro]');
    if (intro.length) {
      gsap.fromTo(
        intro,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.35, clearProps: 'transform' },
      );
    }

    const items = $$('[data-reveal]');
    if (items.length) {
      ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08 }),
      });
    }

    $$('[data-reveal-media]').forEach((media) => {
      const image = $('img', media);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: media, start: 'top 92%', once: true },
      });
      tl.fromTo(
        media,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' },
      );
      if (
        image &&
        !image.dataset.parallax &&
        !image.hasAttribute('data-pan-parallax') &&
        !image.hasAttribute('data-moment-image')
      ) {
        tl.fromTo(image, { scale: 1.3 }, { scale: 1, duration: 1.9, ease: 'expo.out', clearProps: 'scale' }, 0.1);
      }
    });

    $$('[data-parallax]').forEach((image) => {
      const amount = Number(image.dataset.parallax) || 0.15;
      gsap.fromTo(
        image,
        { yPercent: -amount * 50 },
        {
          yPercent: amount * 50,
          ease: 'none',
          scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
  });
}
