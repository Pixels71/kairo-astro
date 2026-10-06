import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, motionEnabled } from '@/utils/dom';

const chart = (figure: HTMLElement, animate: boolean) => {
  const line = $('[data-chart-line]', figure);
  const anomaly = $('[data-chart-anomaly]', figure);
  const marker = $('[data-chart-marker]', figure);
  const label = $('[data-chart-label]', figure);
  const scan = $('[data-chart-scan]', figure);
  if (!animate) {
    gsap.set([line, anomaly], { attr: { 'stroke-dashoffset': 0 } });
    gsap.set([marker, label], { opacity: 1 });
    gsap.set(scan, { opacity: 0 });
    return;
  }
  const tl = gsap.timeline({ scrollTrigger: { trigger: figure, start: 'top 85%', once: true } });
  tl.to(line, { attr: { 'stroke-dashoffset': 0 }, duration: 2, ease: 'power2.inOut' })
    .to(scan, { attr: { x1: 600, x2: 600 }, duration: 2, ease: 'power2.inOut' }, 0)
    .to(anomaly, { attr: { 'stroke-dashoffset': 0 }, duration: 0.6, ease: 'power2.out' }, 1.35)
    .to(marker, { opacity: 1, duration: 0.3 }, 1.6)
    .fromTo(label, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)' }, 1.7)
    .to(scan, { opacity: 0, duration: 0.4 }, 2);
};

const priority = (list: HTMLElement) => {
  let timer = 0;
  const cycle = () => {
    const items = $$('[data-priority-item]', list);
    const state = Flip.getState(items);
    const last = items[items.length - 1];
    list.prepend(last);
    items.forEach((item) => (item.dataset.top = String(item === last)));
    Flip.from(state, { duration: 0.8, ease: 'expo.inOut', absolute: false });
  };
  ScrollTrigger.create({
    trigger: list,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      window.clearInterval(timer);
      if (self.isActive) timer = window.setInterval(cycle, 2800);
    },
  });
};

const typing = (block: HTMLElement) => {
  const target = $('[data-type-text]', block);
  const text = block.dataset.type ?? '';
  if (!target) return;
  target.textContent = '';
  const state = { length: 0 };
  gsap.to(state, {
    length: text.length,
    duration: text.length * 0.028,
    ease: 'none',
    scrollTrigger: { trigger: block, start: 'top 85%', once: true },
    onUpdate: () => {
      target.textContent = text.slice(0, Math.round(state.length));
    },
  });
};

export default function init() {
  const animate = motionEnabled();
  $$('[data-chart]').forEach((figure) => chart(figure, animate));
  if (!animate) return;
  $$('[data-priority]').forEach(priority);
  $$('[data-type]').forEach(typing);
}
