import gsap from 'gsap';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  if (!motionEnabled()) return;
  $$('[data-pan]').forEach((section) => {
    const track = $('[data-pan-track]', section);
    const progress = $('[data-pan-progress]', section);
    if (!track) return;

    gsap.matchMedia().add('(min-width: 1024px)', () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const pan = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      if (progress) {
        gsap.to(progress, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, scrub: 1 },
        });
      }

      $$('[data-pan-parallax]', track).forEach((image) => {
        gsap.fromTo(
          image,
          { xPercent: -7, scale: 1.18 },
          {
            xPercent: 7,
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: image.parentElement,
              containerAnimation: pan,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });
    });
  });
}
