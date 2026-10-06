import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $, $$, finePointer, motionEnabled } from '@/utils/dom';

const connect = (root: HTMLElement) => {
  const wires = $$('[data-connect-wire]', root);
  const packets = $$('[data-connect-packet]', root);
  const nodes = $$('[data-connect-node]', root);
  const hub = $('[data-connect-hub]', root);
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(nodes, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08 })
    .to(wires, { attr: { 'stroke-dashoffset': 0 }, duration: 1.1, ease: 'power2.inOut', stagger: 0.1 }, 0.2)
    .fromTo(hub, { scale: 0, svgOrigin: '470 200' }, { scale: 1, duration: 0.7, ease: 'back.out(2.5)' }, 0.9)
    .set(packets, { opacity: 1 }, 1.2);
  packets.forEach((packet, i) => {
    gsap.fromTo(
      packet,
      { attr: { 'stroke-dashoffset': 1 } },
      { attr: { 'stroke-dashoffset': 0 }, duration: 1.6, ease: 'none', repeat: -1, delay: 1.2 + i * 0.35 },
    );
  });
  ScrollTrigger.create({ trigger: root, start: 'top 75%', once: true, onEnter: () => tl.play() });
};

const tilt = (inner: HTMLElement) => {
  const image = $('[data-stack-image]', inner);
  const rx = gsap.quickTo(inner, 'rotationX', { duration: 0.9, ease: 'power3.out' });
  const ry = gsap.quickTo(inner, 'rotationY', { duration: 0.9, ease: 'power3.out' });
  const ix = image ? gsap.quickTo(image, 'xPercent', { duration: 1.1, ease: 'power3.out' }) : null;
  const iy = image ? gsap.quickTo(image, 'yPercent', { duration: 1.1, ease: 'power3.out' }) : null;
  gsap.set(inner, { transformPerspective: 1600 });
  inner.addEventListener('pointermove', (event) => {
    const box = inner.getBoundingClientRect();
    const nx = (event.clientX - box.left) / box.width - 0.5;
    const ny = (event.clientY - box.top) / box.height - 0.5;
    rx(-ny * 4);
    ry(nx * 5);
    ix?.(nx * -4);
    iy?.(ny * -4);
  });
  inner.addEventListener('pointerleave', () => {
    rx(0);
    ry(0);
    ix?.(0);
    iy?.(0);
  });
};

export default function init() {
  const stack = $('[data-stack]');
  if (!stack || !motionEnabled()) return;
  const cards = $$('[data-stack-card]', stack);
  const inners = cards.map((card) => $('[data-stack-inner]', card)).filter((el): el is HTMLElement => !!el);

  $$('[data-step-connect]', stack).forEach(connect);
  if (finePointer()) inners.forEach(tilt);

  gsap.matchMedia().add('(min-width: 768px)', () => {
    const last = cards[cards.length - 1];
    cards.forEach((card, i) => {
      const inner = inners[i];
      const shade = $('[data-stack-shade]', card);
      if (i > 0) {
        gsap.fromTo(
          inner,
          { rotation: 2.5, yPercent: 8 },
          {
            rotation: 0,
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'top top', scrub: true },
          },
        );
      }
      if (i === cards.length - 1) return;
      ScrollTrigger.create({
        trigger: card,
        start: 'top top',
        endTrigger: last,
        end: 'top top',
        pin: true,
        pinSpacing: false,
      });
      const remaining = cards.length - 1 - i;
      gsap
        .timeline({
          scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', endTrigger: last, end: 'top top', scrub: true },
        })
        .to(inner, { scale: 1 - remaining * 0.05, transformOrigin: '50% 0%', ease: 'none' }, 0)
        .to(shade, { opacity: 0.25 + remaining * 0.2, ease: 'none' }, 0);
    });
  });
}
