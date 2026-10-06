import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, motionEnabled } from '@/utils/dom';

const POINTS = 140;
const TENSION = 0.22;
const SPRING = 0.004;
const DAMPING = 0.035;
const REACH = 0.08;

function createLine(host: HTMLElement) {
  const base = $<SVGPathElement>('[data-line-base]', host);
  const pulse = $<SVGPathElement>('[data-line-pulse]', host);
  if (!base || !pulse) return;
  const spikeAt = Number(host.dataset.spike) || 0.68;

  const offset = new Float32Array(POINTS);
  const velocity = new Float32Array(POINTS);
  const pointer = { x: -1, y: 0, held: false };
  let spike = 0;
  let clock = 0;
  let running = false;
  let frame = 0;

  const shape = (i: number) => {
    const t = i / (POINTS - 1);
    const ambient = Math.sin(t * 9 + clock * 1.3) * 4 + Math.sin(t * 23 - clock * 0.8) * 1.5;
    const bump = Math.exp(-((t - spikeAt) ** 2) / 0.0006) * -70 * spike;
    return ambient + bump;
  };

  const draw = () => {
    let d = '';
    for (let i = 0; i < POINTS; i++) {
      const x = (i / (POINTS - 1)) * 1000;
      const y = 100 + shape(i) + offset[i];
      d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    base.setAttribute('d', d);
    pulse.setAttribute('d', d);
  };

  const step = () => {
    clock += 1 / 60;
    for (let i = 0; i < POINTS; i++) {
      const left = i > 0 ? offset[i - 1] : 0;
      const right = i < POINTS - 1 ? offset[i + 1] : 0;
      const force = TENSION * (left + right - 2 * offset[i]) - SPRING * offset[i] - DAMPING * velocity[i];
      velocity[i] += force;
    }
    for (let i = 1; i < POINTS - 1; i++) offset[i] += velocity[i];

    if (pointer.held) {
      for (let i = 1; i < POINTS - 1; i++) {
        const dx = Math.abs(i / (POINTS - 1) - pointer.x);
        if (dx > REACH) continue;
        const weight = Math.cos((dx / REACH) * (Math.PI / 2)) ** 2;
        const target = (pointer.y - 100) * weight;
        offset[i] += (target - offset[i]) * 0.25;
        velocity[i] *= 0.6;
      }
    }
    draw();
    frame = requestAnimationFrame(step);
  };

  const start = () => {
    if (running) return;
    running = true;
    frame = requestAnimationFrame(step);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  const local = (event: PointerEvent) => {
    const box = host.getBoundingClientRect();
    return {
      x: (event.clientX - box.left) / box.width,
      y: ((event.clientY - box.top) / box.height) * 200,
    };
  };

  host.addEventListener('pointermove', (event) => {
    const p = local(event);
    pointer.x = p.x;
    pointer.y = gsap.utils.clamp(10, 190, p.y);
    pointer.held = true;
  });
  host.addEventListener('pointerleave', () => {
    pointer.held = false;
  });
  host.addEventListener('pointerdown', (event) => {
    const p = local(event);
    const center = Math.round(p.x * (POINTS - 1));
    for (let i = Math.max(1, center - 6); i < Math.min(POINTS - 1, center + 6); i++) {
      velocity[i] += (p.y < 100 ? 1 : -1) * 9 * Math.cos(((i - center) / 6) * (Math.PI / 2));
    }
    gsap.fromTo(
      pulse,
      { attr: { 'stroke-dashoffset': 1.05 - p.x } },
      { attr: { 'stroke-dashoffset': -0.05 }, duration: 1.2 * (1 - p.x) + 0.3, ease: 'none' },
    );
  });

  host.addEventListener('signal:pulse', () => {
    for (let i = 1; i < 10; i++) velocity[i] -= 7 * Math.cos(((i - 1) / 9) * (Math.PI / 2));
    gsap.fromTo(
      pulse,
      { attr: { 'stroke-dashoffset': 1.05, 'stroke-dasharray': '0.12 1' } },
      {
        attr: { 'stroke-dashoffset': -0.12 },
        duration: 1.4,
        ease: 'power2.inOut',
        onComplete: () => pulse.setAttribute('stroke-dasharray', '0.05 1'),
      },
    );
  });

  const rise = { value: 0 };
  draw();
  ScrollTrigger.create({
    trigger: host,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (self.isActive ? start() : stop()),
  });

  gsap
    .timeline({ scrollTrigger: { trigger: host, start: 'top 92%', once: true } })
    .to(base, { attr: { 'stroke-dashoffset': 0 }, ease: 'power2.inOut', duration: 1.6 })
    .to(rise, { value: 1, duration: 0.9, ease: 'expo.out', onUpdate: () => (spike = rise.value) }, 0.9);

  gsap.fromTo(
    pulse,
    { attr: { 'stroke-dashoffset': 1.05 } },
    { attr: { 'stroke-dashoffset': -0.05 }, duration: 2.6, ease: 'power1.inOut', repeat: -1, repeatDelay: 1.8 },
  );
}

export default function init() {
  const lines = $$('[data-signal-line]');
  if (!lines.length) return;
  if (!motionEnabled()) {
    lines.forEach((line) => $('[data-line-base]', line)?.setAttribute('stroke-dashoffset', '0'));
    return;
  }
  lines.forEach(createLine);
}
