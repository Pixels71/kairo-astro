import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  $$('[data-accordion]').forEach((accordion) => {
    const items = $$('[data-accordion-item]', accordion);
    const toggle = (item: HTMLElement, open: boolean) => {
      const trigger = $('[data-accordion-trigger]', item);
      const panel = $('[data-accordion-panel]', item);
      if (!trigger || !panel) return;
      trigger.setAttribute('aria-expanded', String(open));
      if (!motionEnabled()) {
        panel.style.height = open ? 'auto' : '0px';
        return;
      }
      gsap.to(panel, {
        height: open ? 'auto' : 0,
        duration: open ? 0.7 : 0.5,
        ease: open ? 'expo.out' : 'power3.inOut',
        onComplete: () => ScrollTrigger.refresh(),
      });
      const text = panel.firstElementChild;
      if (open && text) gsap.fromTo(text, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.1 });
    };

    items.forEach((item) => {
      $('[data-accordion-trigger]', item)?.addEventListener('click', (event) => {
        const open = (event.currentTarget as HTMLElement).getAttribute('aria-expanded') !== 'true';
        items.forEach((other) => {
          if (other !== item && $('[data-accordion-trigger]', other)?.getAttribute('aria-expanded') === 'true')
            toggle(other, false);
        });
        toggle(item, open);
      });
    });
  });
}
