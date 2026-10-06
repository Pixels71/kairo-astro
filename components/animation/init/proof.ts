import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { $, $$, fontsReady, motionEnabled } from '@/utils/dom';

const DURATION = 7;

export default function init() {
  const section = $('[data-proof]');
  if (!section) return;
  const images = $$('[data-proof-image]', section);
  const items = $$('[data-proof-item]', section);
  const ring = $('[data-proof-ring]', section);
  const prev = $('[data-proof-prev]', section);
  const next = $('[data-proof-next]', section);
  if (items.length < 2) return;

  const animate = motionEnabled();
  let index = 0;
  let timer: gsap.core.Tween | null = null;
  const splits = new Map<HTMLElement, SplitText>();

  const show = (to: number, direction = 1) => {
    const from = index;
    index = (to + items.length) % items.length;
    if (from === index) return;
    const outgoing = items[from];
    const incoming = items[index];
    outgoing.setAttribute('aria-hidden', 'true');
    incoming.removeAttribute('aria-hidden');

    if (!animate) {
      gsap.set(outgoing, { visibility: 'hidden' });
      gsap.set(incoming, { visibility: 'visible' });
      gsap.set(images[from], { clipPath: 'inset(0 0 0 100%)' });
      gsap.set(images[index], { clipPath: 'inset(0 0 0 0%)', zIndex: 1 });
      return;
    }

    const outLines = splits.get(outgoing)?.lines ?? [];
    const inLines = splits.get(incoming)?.lines ?? [];
    const outMeta = $('[data-proof-meta]', outgoing);
    const inMeta = $('[data-proof-meta]', incoming);

    gsap
      .timeline()
      .to(outLines, { yPercent: -110, duration: 0.5, ease: 'power3.in', stagger: 0.04 })
      .to(outMeta, { opacity: 0, duration: 0.3 }, 0)
      .set(outgoing, { visibility: 'hidden' })
      .set(incoming, { visibility: 'visible' })
      .fromTo(inLines, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 })
      .fromTo(inMeta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.6');

    images.forEach((image, i) => gsap.set(image, { zIndex: i === index ? 2 : i === from ? 1 : 0 }));
    gsap.fromTo(
      images[index],
      { clipPath: direction > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0%)', duration: 1.2, ease: 'expo.inOut' },
    );
    gsap.fromTo(images[index], { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'expo.out' });
    restart();
  };

  const restart = () => {
    if (!animate || !ring) return;
    timer?.kill();
    timer = gsap.fromTo(
      ring,
      { attr: { 'stroke-dashoffset': 1 } },
      { attr: { 'stroke-dashoffset': 0 }, duration: DURATION, ease: 'none', onComplete: () => show(index + 1) },
    );
  };

  prev?.addEventListener('click', () => show(index - 1, -1));
  next?.addEventListener('click', () => show(index + 1, 1));

  if (!animate) return;

  fontsReady().then(() => {
    items.forEach((item) => {
      const quote = $('[data-proof-quote]', item);
      if (quote) splits.set(item, SplitText.create(quote, { type: 'lines', mask: 'lines' }));
    });
  });

  ScrollTrigger.create({
    trigger: section,
    start: 'top 70%',
    end: 'bottom top',
    onEnter: restart,
    onEnterBack: () => timer?.resume(),
    onLeave: () => timer?.pause(),
    onLeaveBack: () => timer?.pause(),
  });
}
