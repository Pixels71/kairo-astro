import gsap from 'gsap';
import { $, $$, finePointer, motionEnabled } from '@/utils/dom';

export default function init() {
  if (!finePointer() || !motionEnabled()) return;
  $$('[data-list-preview]').forEach((list) => {
    const frame = $('[data-preview-frame]', list);
    const images = $$('[data-preview-image]', list);
    const links = $$('[data-preview]', list);
    if (!frame) return;

    gsap.set(frame, { xPercent: -50, yPercent: -50, scale: 0, x: 0, y: 0 });
    const xTo = gsap.quickTo(frame, 'x', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(frame, 'y', { duration: 0.7, ease: 'power3.out' });
    const rotateTo = gsap.quickTo(frame, 'rotation', { duration: 0.9, ease: 'power3.out' });
    let lastX = 0;

    window.addEventListener('mousemove', (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
      rotateTo(gsap.utils.clamp(-8, 8, (event.clientX - lastX) * 0.6));
      lastX = event.clientX;
    });

    links.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        images.forEach((image) => {
          const active = image.dataset.previewImage === link.dataset.preview;
          gsap.to(image, { opacity: active ? 1 : 0, scale: active ? 1 : 1.15, duration: 0.6, ease: 'expo.out' });
        });
        gsap.to(frame, { scale: 1, duration: 0.6, ease: 'expo.out' });
      });
    });

    list.addEventListener('mouseleave', () => gsap.to(frame, { scale: 0, duration: 0.45, ease: 'power3.out' }));
    $('[data-filter-grid]', list)?.addEventListener('mouseleave', () =>
      gsap.to(frame, { scale: 0, duration: 0.45, ease: 'power3.out' }),
    );
    document.addEventListener('kairo:navigate', () => gsap.to(frame, { scale: 0, duration: 0.3 }));
  });
}
