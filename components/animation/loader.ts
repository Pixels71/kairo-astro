import gsap from 'gsap';
import { getLenis } from '@/components/animation/lenis-instance';
import { $, $$ } from '@/utils/dom';

const steps = [0, 9, 23, 38, 52, 67, 81, 93, 100];

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

  const letters = $$('[data-loader-letter]', loader);
  const digits = $$('[data-loader-digit]', loader);
  const line = $('[data-loader-line]', loader);
  const content = $('[data-loader-content]', loader);
  const fade = $$('[data-loader-caption], [data-loader-count]', loader);
  const top = $('[data-loader-panel="top"]', loader);
  const bottom = $('[data-loader-panel="bottom"]', loader);
  const page = $('[data-page]');

  const setCount = (value: number) => {
    const text = String(value).padStart(3, '0');
    digits.forEach((digit, i) => {
      digit.style.translate = `0 ${-Number(text[i]) * 10}%`;
    });
  };

  getLenis()?.stop();
  window.scrollTo(0, 0);

  const tl = gsap.timeline({ onComplete: finish });
  tl.fromTo(letters, { yPercent: 100 }, { yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: 0.07 }, 0.1).to(
    fade,
    { opacity: 1, duration: 0.6, ease: 'power2.out' },
    0.3,
  );

  steps.forEach((value, i) => {
    const at = 0.45 + i * 0.19;
    tl.call(() => setCount(value), [], at).to(line, { scaleX: value / 100, duration: 0.4, ease: 'power3.out' }, at);
  });

  tl.add('exit', '+=0.35')
    .to(letters, { yPercent: 100, duration: 0.7, ease: 'power3.in', stagger: 0.045 }, 'exit')
    .to(fade, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 'exit')
    .add('open', '-=0.1')
    .to(content, { opacity: 0, duration: 0.3, ease: 'none' }, 'open')
    .to(top, { yPercent: -100, duration: 1.25, ease: 'expo.inOut' }, 'open')
    .to(bottom, { yPercent: 100, duration: 1.25, ease: 'expo.inOut' }, 'open');

  if (page) {
    tl.fromTo(
      page,
      { scale: 1.08, transformOrigin: '50% 50vh' },
      { scale: 1, duration: 1.6, ease: 'expo.out', clearProps: 'transform,transformOrigin' },
      'open+=0.15',
    );
  }

  tl.call(done, [], 'open+=0.4');
}
