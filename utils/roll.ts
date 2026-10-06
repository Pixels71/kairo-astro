export const setRollText = (host: HTMLElement, text: string) => {
  const roll = document.createElement('span');
  roll.className = 'roll';
  roll.setAttribute('aria-hidden', 'true');
  Array.from(text).forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'roll-char';
    span.dataset.c = char;
    span.style.setProperty('--i', String(i));
    span.textContent = char;
    roll.append(span);
  });
  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = text;
  host.replaceChildren(roll, label);
};
