import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  $$('[data-filter]').forEach((root) => {
    const buttons = $$<HTMLButtonElement>('[data-filter-button]', root);
    const items = $$('[data-filter-item]', root);
    const count = $('[data-filter-count]', root);
    const empty = $('[data-filter-empty]', root);

    const apply = (value: string) => {
      const state = Flip.getState(items, { props: 'opacity' });
      let shown = 0;
      items.forEach((item) => {
        const match = value === 'All' || item.dataset.category === value;
        item.hidden = !match;
        if (match) shown++;
      });
      if (count) count.textContent = `${shown} ${shown === 1 ? count.dataset.one : count.dataset.many}`;
      empty?.classList.toggle('hidden', shown > 0);

      if (motionEnabled()) {
        Flip.from(state, {
          duration: 0.7,
          ease: 'expo.inOut',
          absolute: true,
          stagger: 0.03,
          onEnter: (entering) =>
            gsap.fromTo(entering, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }),
          onLeave: (leaving) => gsap.to(leaving, { opacity: 0, duration: 0.3 }),
          onComplete: () => ScrollTrigger.refresh(),
        });
      }
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
        apply(button.dataset.filterButton ?? 'All');
      });
    });
  });
}
