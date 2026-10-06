const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#%';

export const scramble = (element: HTMLElement, text: string, duration = 0.6) => {
  const start = performance.now();
  const total = duration * 1000;
  const from = element.textContent ?? '';
  const length = Math.max(from.length, text.length);
  const frame = (now: number) => {
    const progress = Math.min(1, (now - start) / total);
    let output = '';
    for (let i = 0; i < length; i++) {
      const settle = i / length;
      if (progress >= settle + 0.25 || progress === 1) output += text[i] ?? '';
      else if (progress > settle * 0.6)
        output += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      else output += from[i] ?? '';
    }
    element.textContent = output;
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};
