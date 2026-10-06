import gsap from 'gsap';
import { getLenis } from '@/components/animation/lenis-instance';
import { $, $$, motionEnabled } from '@/utils/dom';

const KEY = 'kairo:transition';
let busy = false;

interface Pending {
  label: string;
  fromRight: boolean;
}

const parts = () => {
  const overlay = $('[data-transition]');
  return {
    overlay,
    cols: overlay ? $$('[data-transition-col]', overlay) : [],
    label: overlay ? $('[data-transition-label]', overlay) : null,
    bar: overlay ? $('[data-transition-bar]', overlay) : null,
  };
};

export const leavePage = (url: URL, label: string, fromRight: boolean) => {
  const { overlay, cols, label: labelEl, bar } = parts();
  if (busy) return;
  if (!overlay || !labelEl || !motionEnabled()) {
    window.location.href = url.href;
    return;
  }
  busy = true;
  getLenis()?.stop();
  labelEl.textContent = label;
  gsap.set(overlay, { visibility: 'visible', pointerEvents: 'auto' });
  gsap.set(labelEl, { yPercent: 110 });
  gsap.set(bar, { scaleX: 0, opacity: 1 });

  gsap
    .timeline({
      onComplete: () => {
        const pending: Pending = { label, fromRight };
        try {
          sessionStorage.setItem(KEY, JSON.stringify(pending));
        } catch {}
        window.location.href = url.href;
      },
    })
    .fromTo(
      cols,
      { yPercent: 101 },
      { yPercent: 0, duration: 0.8, ease: 'power4.inOut', stagger: { each: 0.06, from: fromRight ? 'end' : 'start' } },
    )
    .to(labelEl, { yPercent: 0, duration: 0.65, ease: 'power3.out' }, '-=0.4')
    .to(bar, { scaleX: 0.55, duration: 0.6, ease: 'power2.out' }, '<');
};

export const playArrive = (done: () => void) => {
  const root = document.documentElement;
  const { overlay, cols, label, bar } = parts();
  let pending: Pending | null = null;
  try {
    pending = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    sessionStorage.removeItem(KEY);
  } catch {}

  if (!overlay) {
    root.classList.remove('is-arriving');
    done();
    return;
  }

  gsap.set(overlay, { visibility: 'visible' });
  gsap.set(cols, { yPercent: 0 });
  gsap.set(label, { yPercent: 0 });
  gsap.set(bar, { scaleX: 0.55 });
  root.classList.remove('is-arriving');
  if (!window.location.hash) window.scrollTo(0, 0);

  gsap
    .timeline({
      delay: 0.05,
      onComplete: () => {
        gsap.set(overlay, { visibility: 'hidden', pointerEvents: 'none' });
        gsap.set(cols, { yPercent: 101 });
        gsap.set(bar, { scaleX: 0, opacity: 1 });
      },
    })
    .to(bar, { scaleX: 1, duration: 0.35, ease: 'power2.inOut' })
    .to(label, { yPercent: -110, duration: 0.5, ease: 'power3.in' }, '-=0.1')
    .add('lift')
    .to(
      cols,
      {
        yPercent: -101,
        duration: 0.95,
        ease: 'power4.inOut',
        stagger: { each: 0.06, from: pending?.fromRight ? 'end' : 'start' },
      },
      'lift-=0.1',
    )
    .to(bar, { opacity: 0, duration: 0.3 }, 'lift')
    .call(done, [], 'lift+=0.25');
};

export const resetTransition = () => {
  const { overlay, cols, label, bar } = parts();
  busy = false;
  document.documentElement.classList.remove('is-arriving');
  if (overlay) gsap.set(overlay, { visibility: 'hidden', pointerEvents: 'none' });
  gsap.set(cols, { yPercent: 101 });
  gsap.set(label, { yPercent: 110 });
  gsap.set(bar, { scaleX: 0, opacity: 1 });
  getLenis()?.start();
};
