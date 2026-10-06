import { setFlow, type Flow } from '@/components/animation/init/number-flow';
import { $, $$ } from '@/utils/dom';

export default function init() {
  const root = $('[data-pricing]');
  if (!root) return;
  const buttons = $$<HTMLButtonElement>('[data-billing]', root);
  const knob = $('[data-billing-knob]', root);
  const cards = $$('article', root);

  const placeKnob = (button: HTMLElement) => {
    if (!knob) return;
    knob.style.width = `${button.offsetWidth}px`;
    knob.style.translate = `${button.offsetLeft - 4}px 0`;
  };

  const select = (period: 'monthly' | 'yearly') => {
    buttons.forEach((button) => {
      const active = button.dataset.billing === period;
      button.setAttribute('aria-checked', String(active));
      if (active) placeKnob(button);
    });
    cards.forEach((card) => {
      const note = $('[data-price-note]', card);
      const flow = $<Flow>('[data-number-flow]', card);
      if (!note || !flow) return;
      const monthly = Number(note.dataset.monthly);
      const value = period === 'yearly' ? Number(note.dataset.yearly) : monthly;
      setFlow(flow, value);
      if (monthly > 0)
        note.textContent =
          period === 'yearly' ? `$${(value * 12).toLocaleString('en-US')} billed yearly` : 'Billed monthly';
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => select(button.dataset.billing === 'yearly' ? 'yearly' : 'monthly'));
    button.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      const other = buttons.find((b) => b !== button);
      other?.focus();
      other?.click();
    });
  });

  const active = buttons.find((button) => button.getAttribute('aria-checked') === 'true');
  if (active) requestAnimationFrame(() => placeKnob(active));
  window.addEventListener('resize', () => {
    const current = buttons.find((button) => button.getAttribute('aria-checked') === 'true');
    if (current) placeKnob(current);
  });
}
