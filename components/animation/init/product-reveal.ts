import gsap from 'gsap';
import { setFlow, type Flow } from '@/components/animation/init/number-flow';
import { $, $$, motionEnabled } from '@/utils/dom';

interface Act {
  count: number;
  unit: string;
}

export default function init() {
  const section = $('[data-product]');
  if (!section || !motionEnabled()) return;
  const acts: Act[] = JSON.parse(section.dataset.acts ?? '[]');
  const tiles = $$('[data-product-tile]', section).filter((tile) => getComputedStyle(tile).display !== 'none');
  const anchor = $('[data-product-anchor]', section);
  const hero = $('[data-product-hero]', section);
  const heroImage = $('[data-product-hero-image]', section);
  const frame = $('[data-product-frame]', section);
  const shade = $('[data-product-shade]', section);
  const ping = $('[data-product-ping]', section);
  const words = $('[data-product-words]', section);
  const captions = $$('[data-product-caption]', section);
  const tabs = $$('[data-product-tab]', section);
  const steps = $$('[data-product-step]', section);
  const flow = $<Flow>('[data-number-flow]', section);
  const unit = $('[data-product-unit]', section);
  if (!anchor || !hero || !frame) return;

  const box = () => {
    const s = section.getBoundingClientRect();
    const a = anchor.getBoundingClientRect();
    return { top: a.top - s.top, left: a.left - s.left, right: s.right - a.right, bottom: s.bottom - a.bottom, a };
  };
  const tileInset = () => {
    const b = box();
    return `inset(${b.top}px ${b.right}px ${b.bottom}px ${b.left}px)`;
  };
  const placeFrame = () => {
    const b = box();
    gsap.set(frame, { top: b.top - 8, left: b.left - 8, width: b.a.width + 16, height: b.a.height + 16 });
  };
  placeFrame();
  window.addEventListener('resize', placeFrame);

  let act = 0;
  const setAct = (next: number) => {
    if (next === act) return;
    const previous = act;
    act = next;
    gsap.to(captions[previous], { opacity: 0, y: -24, duration: 0.35, ease: 'power3.in', overwrite: true });
    gsap.fromTo(
      captions[act],
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', overwrite: true },
    );
    tabs.forEach((tab, i) =>
      i === act ? tab.setAttribute('aria-current', 'step') : tab.removeAttribute('aria-current'),
    );
    if (flow) setFlow(flow, acts[act].count);
    if (unit) {
      gsap
        .timeline()
        .to(unit, { opacity: 0, duration: 0.2 })
        .call(() => {
          unit.textContent = acts[act].unit;
        })
        .to(unit, { opacity: 1, duration: 0.4 });
    }
  };

  const scatter = gsap.utils.random(-1, 1, true);
  gsap.set(hero, { clipPath: tileInset() });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=320%',
      pin: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: placeFrame,
      onUpdate: (self) => {
        const p = self.progress;
        setAct(p < 0.36 ? 0 : p < 0.64 ? 1 : 2);
        steps.forEach((step, i) => {
          const local = gsap.utils.clamp(0, 1, (p - [0, 0.36, 0.64][i]) / [0.36, 0.28, 0.36][i]);
          gsap.set(step, { scaleX: local });
        });
      },
    },
  });

  tl.fromTo(
    tiles,
    {
      x: () => scatter() * window.innerWidth * 0.45,
      y: () => scatter() * window.innerHeight * 0.5,
      rotation: () => scatter() * 14,
      scale: 0.4,
      opacity: 0,
    },
    {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      stagger: { each: 0.04, from: 'random' },
    },
    0,
  )
    .fromTo(hero, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.3)
    .fromTo(heroImage, { scale: 1.4 }, { scale: 1.25, duration: 1.3 }, 0)
    .to(words, { opacity: 0.6, duration: 0.6 }, 0.6);

  tl.to(
    tiles,
    { opacity: 0, scale: 0.7, y: '+=60', duration: 0.6, ease: 'power2.in', stagger: { each: 0.05, from: 'random' } },
    1.5,
  )
    .fromTo(frame, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 1.9)
    .to(words, { opacity: 1, duration: 0.5 }, 1.9);

  tl.to(frame, { opacity: 0, scale: 1.6, duration: 0.4 }, 2.6)
    .fromTo(
      hero,
      { clipPath: () => tileInset() },
      { clipPath: 'inset(0px 0px 0px 0px)', duration: 1.1, ease: 'power3.inOut' },
      2.6,
    )
    .to(heroImage, { scale: 1, duration: 1.3, ease: 'power2.out' }, 2.6)
    .to(words, { opacity: 0, duration: 0.4 }, 2.6)
    .to(shade, { opacity: 1, duration: 0.6 }, 3.1)
    .fromTo(ping, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(3)' }, 3.4)
    .to({}, { duration: 0.5 });
}
