import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onIntro } from '@/components/animation/intro';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  const nav = $('[data-nav]');
  if (!nav) return;
  const items = $$('[data-nav-item]', nav);
  const pill = $('[data-nav-pill]', nav);
  const highlight = $('[data-nav-highlight]', nav);
  const progress = $('[data-nav-progress]', nav);
  const mark = $('[data-logo-hand]', nav);

  if (!motionEnabled()) return;

  onIntro(() => {
    gsap.fromTo(
      items,
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' },
    );
    if (mark) gsap.fromTo(mark, { rotation: -180 }, { rotation: 0, duration: 1.6, ease: 'expo.out' });
  });

  if (pill && highlight) {
    const links = $$<HTMLAnchorElement>('[data-nav-link]', pill);
    const moveTo = (link: HTMLElement, instant = false) => {
      const box = link.getBoundingClientRect();
      const base = pill.getBoundingClientRect();
      gsap.to(highlight, {
        x: box.left - base.left,
        width: box.width,
        opacity: 1,
        duration: instant ? 0 : 0.55,
        ease: 'expo.out',
      });
    };
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => moveTo(link, gsap.getProperty(highlight, 'opacity') === 0));
      link.addEventListener('focus', () => moveTo(link));
    });
    pill.addEventListener('mouseleave', () => gsap.to(highlight, { opacity: 0, duration: 0.35, ease: 'power2.out' }));
  }

  if (progress) {
    gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
    });
  }

  let hidden = false;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const shouldHide = self.direction === 1 && self.scroll() > 240 && !document.documentElement.dataset.menuOpen;
      if (shouldHide === hidden) return;
      hidden = shouldHide;
      gsap.to(nav, { yPercent: hidden ? -130 : 0, duration: hidden ? 0.5 : 0.8, ease: hidden ? 'power3.in' : 'expo.out' });
    },
  });

  if (mark) {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.to(mark, { rotation: self.progress * 360, duration: 0.6, ease: 'power3.out' }),
    });
  }
}
