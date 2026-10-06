import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setFlow, type Flow } from '@/components/animation/init/number-flow';
import { $, $$, motionEnabled } from '@/utils/dom';

interface Entry {
  quote: string;
  name: string;
  role: string;
  company: string;
  metric: { value: number; prefix?: string; suffix?: string; label: string };
}

export default function init() {
  const section = $('[data-ring-section]');
  if (!section) return;
  const stage = $('[data-ring-stage]', section);
  const ring = $('[data-ring]', section);
  const floor = $('[data-ring-floor]', section);
  const cards = $$('[data-ring-card]', section);
  const shades = cards.map((card) => $('[data-ring-shade]', card));
  const quote = $('[data-ring-quote]', section);
  const name = $('[data-ring-name]', section);
  const role = $('[data-ring-role]', section);
  const label = $('[data-ring-label]', section);
  const flow = $<Flow>('[data-number-flow]', section);
  const entries: Entry[] = JSON.parse(section.dataset.ringData ?? '[]');
  if (!stage || !ring || !cards.length) return;

  const animate = motionEnabled();
  const count = cards.length;
  const step = 360 / count;
  const state = { drag: 0, scroll: 0, current: 0 };
  let radius = 0;
  let active = 0;

  const layout = () => {
    const width = cards[0].offsetWidth;
    radius = (width / 2 / Math.tan(((step / 2) * Math.PI) / 180)) * 1.1;
    cards.forEach((card, i) => {
      card.style.transform = `translate(-50%, -50%) rotateY(${-i * step}deg) translateZ(${-radius}px)`;
    });
  };

  const swap = (index: number) => {
    const entry = entries[index];
    if (!entry) return;
    const texts: [HTMLElement | null, string][] = [
      [quote, `“${entry.quote}”`],
      [name, entry.name],
      [role, `${entry.role}, ${entry.company}`],
      [label, entry.metric.label],
    ];
    texts.forEach(([element, value], i) => {
      if (!element) return;
      if (!animate) {
        element.textContent = value;
        return;
      }
      gsap
        .timeline({ delay: i * 0.04 })
        .to(element, { opacity: 0, y: -14, filter: 'blur(6px)', duration: 0.25, ease: 'power2.in', overwrite: true })
        .call(() => {
          element.textContent = value;
        })
        .fromTo(
          element,
          { opacity: 0, y: 18, filter: 'blur(6px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out' },
        );
    });
    if (flow)
      setFlow(flow, entry.metric.value, { prefix: entry.metric.prefix ?? '', suffix: entry.metric.suffix ?? '' });
  };

  const render = () => {
    const total = state.drag + state.scroll;
    state.current += (total - state.current) * (animate ? 0.09 : 1);
    ring.style.transform = `translateZ(${radius - 180}px) rotateY(${state.current}deg)`;
    if (floor) floor.style.backgroundPosition = `${state.current * 7}px 0`;

    cards.forEach((card, i) => {
      const angle = ((((-i * step + state.current) % 360) + 540) % 360) - 180;
      const away = Math.min(1, Math.abs(angle) / 80);
      const shade = shades[i];
      if (shade) shade.style.opacity = String(away * 0.7);
      card.style.visibility = Math.abs(angle) > 100 ? 'hidden' : 'visible';
    });

    const front = (((Math.round(state.current / step) % count) + count) % count) % entries.length;
    if (front !== active) {
      active = front;
      swap(active);
    }
  };

  const snap = (velocity = 0) => {
    const projected = state.drag + state.scroll + velocity;
    const target = Math.round(projected / step) * step;
    gsap.to(state, { drag: target - state.scroll, duration: 1, ease: 'expo.out', overwrite: true });
  };

  let pointerX = 0;
  let startDrag = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let dragging = false;
  let moved = false;

  stage.addEventListener('pointerdown', (event) => {
    dragging = true;
    moved = false;
    pointerX = lastX = event.clientX;
    lastT = performance.now();
    startDrag = state.drag;
    velocity = 0;
    gsap.killTweensOf(state);
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - pointerX;
    if (Math.abs(dx) > 4) moved = true;
    state.drag = startDrag - dx * 0.12;
    const now = performance.now();
    velocity = ((event.clientX - lastX) / Math.max(1, now - lastT)) * 16;
    lastX = event.clientX;
    lastT = now;
  });

  const release = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    stage.releasePointerCapture(event.pointerId);
    if (!moved) {
      const card = (event.target as Element).closest<HTMLElement>('[data-ring-card]');
      if (card) {
        const angle = ((((-Number(card.dataset.slot) * step + state.current) % 360) + 540) % 360) - 180;
        gsap.to(state, { drag: state.drag - angle, duration: 1.1, ease: 'expo.out', overwrite: true });
      }
      return;
    }
    snap(-velocity * 0.12 * 8);
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  $('[data-ring-prev]', section)?.addEventListener('click', () =>
    gsap.to(state, {
      drag: Math.round((state.drag - step) / step) * step,
      duration: 1,
      ease: 'expo.out',
      overwrite: true,
    }),
  );
  $('[data-ring-next]', section)?.addEventListener('click', () =>
    gsap.to(state, {
      drag: Math.round((state.drag + step) / step) * step,
      duration: 1,
      ease: 'expo.out',
      overwrite: true,
    }),
  );

  layout();
  window.addEventListener('resize', layout);
  render();

  let ticking = false;
  let settle = 0;
  const tick = () => render();
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      if (!animate) return;
      state.scroll = self.progress * step * 3;
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (!dragging) snap();
      }, 260);
    },
    onToggle: (self) => {
      if (self.isActive && !ticking) {
        gsap.ticker.add(tick);
        ticking = true;
      } else if (!self.isActive && ticking) {
        gsap.ticker.remove(tick);
        ticking = false;
      }
    },
  });
}
