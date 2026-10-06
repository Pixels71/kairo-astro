import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setFlow, type Flow } from '@/components/animation/init/number-flow';
import { onIntro } from '@/components/animation/intro';
import { $, $$, finePointer, motionEnabled } from '@/utils/dom';

const HOLD = 4.2;

export default function init() {
  const root = $('[data-moments]');
  const hero = $('[data-hero]');
  if (!root || !hero || !motionEnabled()) return;

  const slides = $$('[data-moment]', root);
  const frame = $('[data-moments-frame]', root);
  const flow = $<Flow>('[data-number-flow]', root);
  const ticks = $$('[data-moment-tick]', root);
  const texts = $$('[data-moment-text]', root);
  if (slides.length < 2 || !frame) return;

  let index = 0;
  let timer: gsap.core.Tween | null = null;
  let tick: gsap.core.Tween | null = null;
  let drift: gsap.core.Tween | null = null;
  let paused = false;

  const image = (slide: HTMLElement) => $('[data-moment-image]', slide);

  const pulse = () => {
    const box = frame.getBoundingClientRect();
    document.dispatchEvent(new CustomEvent('kairo:pulse', { detail: { x: box.left, y: box.top + box.height * 0.42 } }));
  };

  const hold = () => {
    timer?.kill();
    tick?.kill();
    drift?.kill();
    ticks.forEach((bar, i) => gsap.set(bar, { scaleX: i < index ? 1 : 0 }));
    tick = gsap.fromTo(ticks[index], { scaleX: 0 }, { scaleX: 1, duration: HOLD, ease: 'none' });
    drift = gsap.fromTo(
      image(slides[index]),
      { scale: 1.12 },
      { scale: 1, xPercent: index % 2 ? -2 : 2, duration: HOLD + 1.4, ease: 'none' },
    );
    timer = gsap.delayedCall(HOLD, () => show((index + 1) % slides.length));
    if (paused) [timer, tick, drift].forEach((t) => t?.pause());
  };

  const swapText = (slide: HTMLElement) => {
    texts.forEach((text) => {
      const value = text.dataset.momentText === 'client' ? slide.dataset.client : slide.dataset.label;
      gsap
        .timeline()
        .to(text, { yPercent: -110, opacity: 0, duration: 0.35, ease: 'power3.in' })
        .call(() => {
          text.textContent = value ?? '';
        })
        .fromTo(text, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
    });
  };

  const show = (next: number) => {
    const previous = slides[index];
    const current = slides[next];
    index = next;

    slides.forEach((slide) => {
      const z = slide === current ? 2 : slide === previous ? 1 : 0;
      gsap.set(slide, { zIndex: z });
      slide.setAttribute('aria-hidden', String(slide !== current));
    });

    gsap.fromTo(
      current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' },
    );
    gsap.to(image(previous), { yPercent: -8, scale: 1.18, duration: 1.3, ease: 'expo.inOut' });
    gsap.set(image(current), { yPercent: 0, xPercent: 0 });

    swapText(current);
    if (flow) {
      setFlow(flow, Number(current.dataset.value), {
        prefix: current.dataset.prefix ?? '',
        suffix: current.dataset.suffix ?? '',
      });
    }
    gsap.delayedCall(0.45, pulse);
    hold();
  };

  const setPaused = (value: boolean) => {
    paused = value;
    [timer, tick, drift].forEach((t) => (value ? t?.pause() : t?.resume()));
  };

  root.addEventListener('mouseenter', () => setPaused(true));
  root.addEventListener('mouseleave', () => setPaused(false));
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onLeave: () => setPaused(true),
    onEnterBack: () => setPaused(false),
  });

  if (finePointer()) {
    const layers = $$('[data-depth]', root).map((layer) => ({
      depth: Number(layer.dataset.depth) || 1,
      x: gsap.quickTo(layer, 'x', { duration: 1.2, ease: 'power3.out' }),
      y: gsap.quickTo(layer, 'y', { duration: 1.2, ease: 'power3.out' }),
    }));
    hero.addEventListener('pointermove', (event) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      layers.forEach((layer) => {
        layer.x(nx * -22 * layer.depth);
        layer.y(ny * -16 * layer.depth);
      });
    });
    hero.addEventListener('pointerleave', () => layers.forEach((layer) => (layer.x(0), layer.y(0))));
  }

  onIntro(() => {
    hold();
    gsap.delayedCall(0.9, pulse);
  });
}
