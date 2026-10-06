import gsap from 'gsap';
import { onIntro } from '@/components/animation/intro';
import { $$, motionEnabled } from '@/utils/dom';

interface Pulse {
  x: number;
  y: number;
  born: number;
}

const BONE = '235, 233, 226';
const SIGNAL = '255, 91, 31';
const PULSE_LIFE = 2.8;
const PULSE_SPEED = 240;
const REPEL = 170;

function createField(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const host = canvas.parentElement ?? canvas;
  const animate = motionEnabled();
  const pulses: Pulse[] = [];
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, power: 0, target: 0 };
  const intro = { radius: animate ? 0 : 99999 };
  const origin = { x: 0, y: 0 };

  let width = 0;
  let height = 0;
  let gap = 26;
  let cols = 0;
  let rows = 0;
  let offsetX = 0;
  let offsetY = 0;
  let running = false;
  let visible = true;
  let frame = 0;
  let nextPulse = 1.2;
  let clock = 0;
  let last = performance.now();

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    gap = width < 768 ? 22 : 26;
    cols = Math.ceil(width / gap) + 1;
    rows = Math.ceil(height / gap) + 1;
    offsetX = (width - (cols - 1) * gap) / 2;
    offsetY = (height - (rows - 1) * gap) / 2;
    origin.x = width / 2;
    origin.y = height / 2;
    if (!animate) draw();
  };

  const spawn = (x?: number, y?: number) => {
    const px = x ?? width * (0.3 + Math.random() * 0.3);
    const py = y ?? height * (0.12 + Math.random() * 0.4);
    const snapX = offsetX + Math.round((px - offsetX) / gap) * gap;
    const snapY = offsetY + Math.round((py - offsetY) / gap) * gap;
    pulses.push({ x: snapX, y: snapY, born: clock });
    if (pulses.length > 4) pulses.shift();
  };

  const draw = () => {
    const t = clock;
    mouse.x += (mouse.tx - mouse.x) * 0.35;
    mouse.y += (mouse.ty - mouse.y) * 0.35;
    mouse.power += (mouse.target - mouse.power) * 0.08;
    ctx.clearRect(0, 0, width, height);

    const hot: number[] = [];
    ctx.fillStyle = `rgb(${BONE})`;

    for (let i = 0; i < cols; i++) {
      const bx = offsetX + i * gap;
      for (let j = 0; j < rows; j++) {
        const by = offsetY + j * gap;
        const fromOrigin = Math.hypot(bx - origin.x, by - origin.y);
        const shown = Math.min(1, Math.max(0, (intro.radius - fromOrigin) / 140));
        if (shown <= 0) continue;

        const wave =
          Math.sin(bx * 0.006 + t * 0.7) * Math.cos(by * 0.008 - t * 0.5) + Math.sin((bx + by) * 0.004 + t * 0.9) * 0.5;
        let x = bx;
        let y = by + wave * 5;
        let lift = 0;

        const mx = bx - mouse.x;
        const my = by - mouse.y;
        const distance = Math.hypot(mx, my);
        if (distance < REPEL && mouse.power > 0.01) {
          const force = (1 - distance / REPEL) ** 2 * mouse.power;
          const nx = distance ? mx / distance : 0;
          const ny = distance ? my / distance : 0;
          x += nx * force * 30;
          y += ny * force * 30;
          lift = force;
        }

        let heat = 0;
        for (const pulse of pulses) {
          const age = t - pulse.born;
          if (age < 0 || age > PULSE_LIFE) continue;
          const ring = age * PULSE_SPEED;
          const d = Math.hypot(x - pulse.x, y - pulse.y);
          const band = Math.exp(-((d - ring) ** 2) / 1400) * (1 - age / PULSE_LIFE);
          const core = Math.exp(-(d * d) / 900) * Math.max(0, 1 - age / 1.2);
          heat = Math.max(heat, band, core);
        }

        const alpha = (0.1 + ((wave + 1.5) / 3) * 0.32 + lift * 0.45) * shown;
        const size = (width < 768 ? 1.4 : 1.7) + lift * 1.8 + heat * 1.4;
        if (heat > 0.04) {
          hot.push(x, y, size, Math.min(1, alpha + heat * 0.85));
          continue;
        }
        ctx.globalAlpha = alpha;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }

    ctx.fillStyle = `rgb(${SIGNAL})`;
    for (let k = 0; k < hot.length; k += 4) {
      ctx.globalAlpha = hot[k + 3];
      ctx.fillRect(hot[k] - hot[k + 2] / 2, hot[k + 1] - hot[k + 2] / 2, hot[k + 2], hot[k + 2]);
    }

    for (const pulse of pulses) {
      const age = t - pulse.born;
      if (age < 0 || age > PULSE_LIFE) continue;
      const fade = 1 - age / PULSE_LIFE;
      ctx.globalAlpha = fade * 0.55;
      ctx.strokeStyle = `rgb(${SIGNAL})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, age * PULSE_SPEED, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = Math.max(0, 1 - age / 1.6);
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${SIGNAL})`;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const loop = (now: number) => {
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += delta;
    if (clock > nextPulse) {
      spawn();
      nextPulse = clock + 2.4 + Math.random() * 1.4;
    }
    draw();
    frame = requestAnimationFrame(loop);
  };

  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
  };

  resize();
  new ResizeObserver(resize).observe(canvas);

  if (!animate) {
    spawn(width * 0.72, height * 0.32);
    clock = 0.9;
    draw();
    return;
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  }).observe(canvas);

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  const toLocal = (clientX: number, clientY: number) => {
    const box = canvas.getBoundingClientRect();
    const scaleX = box.width / (width || 1);
    const scaleY = box.height / (height || 1);
    return { x: (clientX - box.left) / scaleX, y: (clientY - box.top) / scaleY, box };
  };

  host.addEventListener('pointermove', (event) => {
    const point = toLocal(event.clientX, event.clientY);
    mouse.tx = point.x;
    mouse.ty = point.y;
    if (mouse.power < 0.05) {
      mouse.x = mouse.tx;
      mouse.y = mouse.ty;
    }
    mouse.target = 1;
  });
  host.addEventListener('pointerleave', () => {
    mouse.target = 0;
  });
  host.addEventListener('click', (event) => {
    if ((event.target as Element).closest('a, button')) return;
    const point = toLocal(event.clientX, event.clientY);
    spawn(point.x, point.y);
  });

  document.addEventListener('kairo:pulse', (event) => {
    const { x, y } = (event as CustomEvent<{ x: number; y: number }>).detail;
    const point = toLocal(x, y);
    const box = point.box;
    if (x < box.left || x > box.right || y < box.top || y > box.bottom) return;
    spawn(point.x, point.y);
    nextPulse = clock + 2.6;
  });

  start();
  onIntro(() => {
    gsap.to(intro, { radius: Math.hypot(width, height), duration: 2.2, ease: 'power2.inOut' });
    nextPulse = clock + 1.1;
  });
}

export default function init() {
  $$<HTMLCanvasElement>('[data-signal-field]').forEach(createField);
}
