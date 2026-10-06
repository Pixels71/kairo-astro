import gsap from 'gsap';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  const section = $('[data-product]');
  if (!section || !motionEnabled()) return;
  const media = $('[data-product-media]', section);
  const image = $('[data-product-image]', section);
  const shade = $('[data-product-shade]', section);
  const left = $('[data-product-word="left"]', section);
  const right = $('[data-product-word="right"]', section);
  const captions = $$('[data-product-caption]', section);
  const steps = $$('[data-product-step]', section);

  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 768px)', mobile: '(max-width: 767px)' }, (context) => {
    const desktop = Boolean(context.conditions?.desktop);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: section, start: 'top top', end: '+=260%', pin: true, scrub: 0.8, anticipatePin: 1 },
    });

    tl.fromTo(
      media,
      { clipPath: desktop ? 'inset(30% 33% 30% 33%)' : 'inset(30% 12% 30% 12%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' },
      0,
    )
      .fromTo(image, { scale: 1.35 }, { scale: 1, duration: 1.4, ease: 'power2.out' }, 0)
      .to(left, desktop ? { xPercent: -120, opacity: 0, duration: 1 } : { yPercent: -160, opacity: 0, duration: 1 }, 0)
      .to(right, desktop ? { xPercent: 120, opacity: 0, duration: 1 } : { yPercent: 160, opacity: 0, duration: 1 }, 0)
      .to(shade, { opacity: 1, duration: 0.5 }, 0.8);

    captions.forEach((caption, i) => {
      const at = 1.1 + i * 0.9;
      tl.fromTo(caption, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 }, at).to(
        steps[i],
        { scaleX: 1, duration: 0.9 },
        at,
      );
      if (i < captions.length - 1) tl.to(caption, { opacity: 0, y: -30, duration: 0.25 }, at + 0.7);
    });
    tl.to({}, { duration: 0.3 });
  });
}
