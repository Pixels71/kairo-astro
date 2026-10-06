import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, motionEnabled } from '@/utils/dom';
import { setRollText } from '@/utils/roll';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function init() {
  const form = $<HTMLFormElement>('[data-sales-form]');
  if (!form) return;
  const intents = $$<HTMLInputElement>('[data-intent-input]', form);
  const demoOnly = $('[data-demo-only]', form);
  const submit = $<HTMLButtonElement>('[data-sales-submit]', form);
  const label = $('[data-submit-label]', form);
  const status = $('[data-sales-status]', form);

  const setIntent = (intent: string) => {
    intents.forEach((input) => (input.checked = input.value === intent));
    if (demoOnly) {
      demoOnly.hidden = intent !== 'demo';
      if (intent === 'demo' && motionEnabled())
        gsap.fromTo(demoOnly, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 });
    }
    if (label) setRollText(label, intent === 'demo' ? (label.dataset.demo ?? '') : (label.dataset.free ?? ''));
    ScrollTrigger.refresh();
  };

  const readUrl = () => {
    const intent = new URLSearchParams(window.location.search).get('intent');
    setIntent(intent === 'demo' ? 'demo' : 'free');
  };

  intents.forEach((input) => input.addEventListener('change', () => setIntent(input.value)));
  document.addEventListener('kairo:url', readUrl);
  readUrl();

  const setError = (name: string, message: string) => {
    const input = form.elements.namedItem(name) as HTMLInputElement | null;
    const error = $(`[data-error-for="${name}"]`, form);
    input?.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
    return !message;
  };

  $$<HTMLInputElement>('input[required]', form).forEach((input) => {
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') setError(input.name, '');
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const valid = [
      setError('name', name ? '' : (form.dataset.errorName ?? '')),
      setError('email', EMAIL.test(email) ? '' : (form.dataset.errorEmail ?? '')),
      setError('company', company ? '' : (form.dataset.errorCompany ?? '')),
    ].every(Boolean);

    if (!valid) {
      $<HTMLInputElement>('[aria-invalid="true"]', form)?.focus();
      if (status) status.textContent = '';
      return;
    }

    if (!submit || !status) return;
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    status.className = 'mt-6 min-h-6 text-sm text-mute';
    status.textContent = form.dataset.sending ?? '';

    setTimeout(() => {
      const demo = data.get('intent') === 'demo';
      status.className = 'mt-6 min-h-6 text-sm text-bone';
      const template = (demo ? form.dataset.successDemo : form.dataset.successFree) ?? '';
      status.textContent = template.replace('{name}', name.split(' ')[0]).replace('{email}', email);
      submit.removeAttribute('aria-busy');
      form.reset();
      setIntent(demo ? 'demo' : 'free');
      setTimeout(() => (submit.disabled = false), 1500);
    }, 1200);
  });
}
