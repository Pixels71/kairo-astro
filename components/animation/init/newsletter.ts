import { $, $$ } from '@/utils/dom';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function init() {
  $$<HTMLFormElement>('[data-newsletter]').forEach((form) => {
    const field = $('[data-newsletter-field]', form);
    const input = $<HTMLInputElement>('input', form);
    const submit = $<HTMLButtonElement>('[data-newsletter-submit]', form);
    const status = $('[data-newsletter-status]', form);
    if (!field || !input || !submit || !status) return;
    const idle = status.textContent ?? '';

    const setState = (state: 'idle' | 'error' | 'loading' | 'success', message: string) => {
      field.dataset.state = state;
      status.textContent = message;
      status.classList.toggle('text-signal', state === 'error');
      status.classList.toggle('text-bone', state === 'success');
      submit.disabled = state === 'loading' || state === 'success';
      submit.setAttribute('aria-busy', String(state === 'loading'));
      input.setAttribute('aria-invalid', String(state === 'error'));
    };

    input.addEventListener('input', () => {
      if (field.dataset.state === 'error') setState('idle', idle);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!EMAIL.test(input.value.trim())) {
        setState('error', 'That email looks incomplete. Try name@company.com.');
        input.focus();
        return;
      }
      setState('loading', 'Subscribing...');
      setTimeout(() => {
        setState('success', 'You are in. The first issue lands on Friday.');
        input.value = '';
        input.disabled = true;
      }, 1100);
    });
  });
}
