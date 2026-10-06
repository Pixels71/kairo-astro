import gsap from 'gsap';
import { setFlow, type Flow } from '@/components/animation/init/number-flow';
import { getLenis } from '@/components/animation/lenis-instance';
import { $, $$ } from '@/utils/dom';

const steps = [0, 7, 18, 26, 41, 53, 62, 78, 86, 94, 100];
const STEP = 0.24;

export default function playLoader(done: () => void) {
  const root = document.documentElement;
  const loader = $('[data-loader]');
  const finish = () => {
    root.classList.remove('is-loading');
    loader?.remove();
    try {
      sessionStorage.setItem('kairo:loaded', '1');
    } catch {}
    getLenis()?.start();
  };
  if (!loader) {
    finish();
    done();
    return;
  }

  const veil = $('[data-loader-veil]', loader);
  const content = $('[data-loader-content]', loader);
  const modules = $$('[data-loader-module]', loader);
  const ring = $('[data-loader-ring]', loader);
  const arc = $('[data-loader-arc]', loader);
  const hand = $('[data-loader-hand]', loader);
  const lens = $('[data-loader-lens]', loader);
  const frames = $$('[data-loader-frame]', loader);
  const readout = $('[data-loader-readout]', loader);
  const percent = $<Flow>('[data-number-flow]', readout ?? loader);
  const caption = $('[data-loader-caption]', loader);
  const page = $('[data-page]');

  getLenis()?.stop();
  window.scrollTo(0, 0);

  const iris = { r: 0 };
  const setIris = () => {
    if (!veil) return;
    const mask = `radial-gradient(circle at 50% 50%, transparent ${iris.r}px, #000 ${iris.r + 1.5}px)`;
    veil.style.maskImage = mask;
    veil.style.setProperty('-webkit-mask-image', mask);
  };

  const tl = gsap.timeline({ onComplete: finish });

  tl.fromTo(
    ring,
    { scale: 0.7, opacity: 0, rotation: -40 },
    { scale: 1, opacity: 1, rotation: 0, duration: 1.4, ease: 'expo.out' },
    0,
  )
    .fromTo(lens, { scale: 0.4 }, { scale: 1, duration: 1.2, ease: 'expo.out' }, 0.1)
    .to(readout, { opacity: 1, duration: 0.6 }, 0.3);

  frames.forEach((frame, i) => {
    const at = 0.35 + i * 0.3;
    tl.fromTo(frame, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }, at);
    if (i > 0) tl.set(frames[i - 1], { opacity: 0 }, at + 0.18);
  });

  steps.forEach((value, i) => {
    const at = 0.4 + i * STEP;
    tl.call(
      () => {
        if (percent) setFlow(percent, value);
      },
      [],
      at,
    )
      .to(arc, { attr: { 'stroke-dashoffset': 1 - value / 100 }, duration: STEP + 0.1, ease: 'power2.out' }, at)
      .to(hand, { rotation: value * 3.6, duration: STEP + 0.1, ease: 'power2.out' }, at);
  });

  modules.forEach((module, i) => {
    const at = 0.45 + i * 0.5;
    const status = $('[data-loader-status]', module);
    const flow = $<Flow>('[data-number-flow]', module);
    tl.fromTo(module, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, at)
      .call(
        () => {
          if (status) status.textContent = 'Syncing';
          if (flow) setFlow(flow, Number(module.dataset.count));
        },
        [],
        at + 0.2,
      )
      .call(
        () => {
          if (!status) return;
          status.textContent = 'Live';
          status.classList.replace('text-dim', 'text-signal');
        },
        [],
        at + 1.1,
      );
  });

  const end = 0.4 + (steps.length - 1) * STEP;
  tl.call(
    () => {
      if (caption) caption.textContent = 'Signal locked';
    },
    [],
    end + 0.1,
  )
    .fromTo(hand, { scale: 1 }, { scale: 1.6, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }, end + 0.1)
    .add('open', end + 0.65)
    .call(
      () => {
        iris.r = lens ? lens.getBoundingClientRect().width / 2 : 0;
        setIris();
      },
      [],
      'open',
    )
    .to(frames, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 'open')
    .to(lens, { opacity: 0, duration: 0.3 }, 'open')
    .to(
      iris,
      {
        r: () => Math.hypot(window.innerWidth, window.innerHeight) / 2 + 40,
        duration: 1.5,
        ease: 'expo.inOut',
        onUpdate: setIris,
      },
      'open+=0.15',
    )
    .to(modules, { opacity: 0, y: -12, duration: 0.5, ease: 'power2.in', stagger: 0.04 }, 'open+=0.1')
    .to([ring, readout], { opacity: 0, scale: 1.25, duration: 0.9, ease: 'power3.in' }, 'open+=0.15')
    .set(content, { opacity: 0 }, 'open+=1.1');

  if (page) {
    tl.fromTo(
      page,
      { scale: 1.12, transformOrigin: '50% 50vh' },
      { scale: 1, duration: 1.9, ease: 'expo.out', clearProps: 'transform,transformOrigin' },
      'open+=0.2',
    );
  }

  tl.call(done, [], 'open+=0.75');
}
