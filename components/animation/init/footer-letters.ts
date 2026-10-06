import gsap from 'gsap';
import type MatterTypes from 'matter-js';
import { $, $$, finePointer, motionEnabled } from '@/utils/dom';

type Matter = typeof MatterTypes;

const WALL = 200;

const build = (Matter: Matter, mark: HTMLElement) => {
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events, Query } = Matter;
  const letters = $$('[data-footer-letter]', mark);
  const hint = $('[data-footer-hint]', mark);
  const engine = Engine.create({ gravity: { x: 0, y: 1.4 }, positionIterations: 10, velocityIterations: 8 });
  const fine = finePointer();

  const fontSize = parseFloat(getComputedStyle(letters[0]).fontSize);
  const markBox = mark.getBoundingClientRect();
  const width = markBox.width;
  const height = markBox.height;
  const homes = letters.map((letter) => {
    const box = letter.getBoundingClientRect();
    return {
      x: box.left - markBox.left + box.width / 2,
      y: box.top - markBox.top + box.height / 2,
      w: box.width,
      h: box.height,
    };
  });

  const sizes = homes.map((home) => ({
    w: Math.max(home.w + fontSize * 0.05, home.h * 0.46),
    h: home.h * 0.86,
  }));
  const gap = fontSize * 0.03;
  const total = sizes.reduce((sum, size) => sum + size.w, 0) + gap * (sizes.length - 1);
  let cursor = (width - total) / 2;
  const spawnX = sizes.map((size) => {
    const x = cursor + size.w / 2;
    cursor += size.w + gap;
    return x;
  });

  const bodies = homes.map((home, i) =>
    Bodies.rectangle(spawnX[i], -home.h * 0.6 - i * 70, sizes[i].w, sizes[i].h, {
      chamfer: { radius: fontSize * 0.02 },
      restitution: 0.22,
      friction: 0.6,
      frictionStatic: 0.9,
      frictionAir: 0.014,
      density: 0.0018,
      angle: gsap.utils.random(-0.06, 0.06),
    }),
  );

  const walls = [
    Bodies.rectangle(width / 2, height + WALL / 2, width * 3, WALL, { isStatic: true }),
    Bodies.rectangle(-WALL / 2, height / 2 - height, WALL, height * 4, { isStatic: true }),
    Bodies.rectangle(width + WALL / 2, height / 2 - height, WALL, height * 4, { isStatic: true }),
  ];
  Composite.add(engine.world, [...walls]);

  bodies.forEach((body, i) => {
    gsap.delayedCall(i * 0.14, () => Composite.add(engine.world, body));
  });
  gsap.set(letters, { opacity: 1 });

  const render = () => {
    bodies.forEach((body, i) => {
      const home = homes[i];
      letters[i].style.transform =
        `translate3d(${body.position.x - home.x}px, ${body.position.y - home.y}px, 0) rotate(${body.angle}rad)`;
    });
  };
  render();

  if (fine) {
    const mouse = Mouse.create(mark);
    const anyMouse = mouse as unknown as { mousewheel: EventListener };
    mark.removeEventListener('wheel', anyMouse.mousewheel);
    mark.removeEventListener('mousewheel', anyMouse.mousewheel);
    mark.removeEventListener('DOMMouseScroll', anyMouse.mousewheel);
    const grab = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, damping: 0.08, render: { visible: false } },
    });
    Composite.add(engine.world, grab);
    Events.on(grab, 'startdrag', (event) => {
      const index = bodies.indexOf((event as unknown as { body: MatterTypes.Body }).body);
      if (index >= 0) letters[index].dataset.grab = 'true';
    });
    Events.on(grab, 'enddrag', () => letters.forEach((letter) => delete letter.dataset.grab));

    mark.addEventListener('pointermove', (event) => {
      if (grab.body) return;
      const box = mark.getBoundingClientRect();
      const point = { x: event.clientX - box.left, y: event.clientY - box.top };
      bodies.forEach((body) => {
        const dx = body.position.x - point.x;
        const dy = body.position.y - point.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 180 || distance === 0) return;
        const strength = (1 - distance / 180) * 0.012 * body.mass;
        Body.applyForce(body, body.position, { x: (dx / distance) * strength, y: -Math.abs(strength) * 0.6 });
      });
    });

    mark.addEventListener('dblclick', () => {
      bodies.forEach((body, i) => {
        gsap.delayedCall(i * 0.1, () => {
          Body.setVelocity(body, { x: 0, y: 0 });
          Body.setAngularVelocity(body, 0);
          Body.setAngle(body, gsap.utils.random(-0.15, 0.15));
          Body.setPosition(body, { x: spawnX[i], y: -homes[i].h });
        });
      });
    });
  } else {
    if (hint) hint.textContent = 'Tap a letter';
    mark.addEventListener('pointerdown', (event) => {
      const box = mark.getBoundingClientRect();
      const point = { x: event.clientX - box.left, y: event.clientY - box.top };
      Query.point(bodies, point).forEach((body) => {
        Body.setVelocity(body, { x: gsap.utils.random(-6, 6), y: -14 });
        Body.setAngularVelocity(body, gsap.utils.random(-0.3, 0.3));
      });
    });
  }

  if (hint) gsap.to(hint, { opacity: 1, duration: 0.8, delay: 1.4 });

  let running = false;
  const TICK = 1000 / 60;
  let pending = 0;
  const step = (_time: number, delta: number) => {
    pending = Math.min(pending + delta, TICK * 4);
    while (pending >= TICK) {
      Engine.update(engine, TICK);
      pending -= TICK;
    }
    render();
  };
  const start = () => {
    if (running) return;
    running = true;
    gsap.ticker.add(step);
  };
  const stop = () => {
    running = false;
    gsap.ticker.remove(step);
  };
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(mark);
  start();
};

export default function init() {
  const mark = $('[data-footer-mark]');
  if (!mark || !motionEnabled()) return;
  gsap.set($$('[data-footer-letter]', mark), { opacity: 0 });

  const observer = new IntersectionObserver(
    async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const Matter = (await import('matter-js')).default as unknown as Matter;
      build(Matter, mark);
    },
    { threshold: 0.35 },
  );
  observer.observe(mark);
}
