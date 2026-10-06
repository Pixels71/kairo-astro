import { $$ } from '@/utils/dom';

const place = (button: HTMLElement, event: MouseEvent) => {
  const box = button.getBoundingClientRect();
  button.style.setProperty('--x', `${event.clientX - box.left}px`);
  button.style.setProperty('--y', `${event.clientY - box.top}px`);
  button.style.setProperty('--d', `${Math.hypot(box.width, box.height) * 2.2}px`);
};

export default function init() {
  for (const button of $$('[data-btn]')) {
    button.addEventListener('mouseenter', (event) => place(button, event));
    button.addEventListener('mouseleave', (event) => place(button, event));
  }
}
