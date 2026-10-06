import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onIntro } from '@/components/animation/intro';
import { $$, motionEnabled } from '@/utils/dom';

export const setOdometer = (element: HTMLElement) => {
  $$('.odo-col', element).forEach((column) => {
    column.style.translate = `0 ${-Number(column.dataset.digit) * 10}%`;
  });
};

export default function init() {
  const counters = $$('[data-odo]');
  if (!counters.length) return;
  if (!motionEnabled()) {
    counters.forEach(setOdometer);
    return;
  }
  onIntro(() => {
    counters.forEach((counter) => {
      ScrollTrigger.create({ trigger: counter, start: 'top 92%', once: true, onEnter: () => setOdometer(counter) });
    });
  });
}
