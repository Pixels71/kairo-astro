import gsap from 'gsap';
import { getLenis } from '@/components/animation/lenis-instance';
import { $, $$, motionEnabled } from '@/utils/dom';

export default function init() {
  const menu = $('[data-menu]');
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  if (!menu || !toggle) return;
  const root = document.documentElement;
  const links = $$('[data-menu-link]', menu);
  const meta = $('[data-menu-meta]', menu);
  const images = $$('[data-menu-image]', menu);
  let open = false;
  let tl: gsap.core.Timeline | null = null;

  const origin = () => {
    const box = toggle.getBoundingClientRect();
    return `${box.left + box.width / 2}px ${box.top + box.height / 2}px`;
  };

  const setOpen = (next: boolean) => {
    if (next === open) return;
    open = next;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) root.dataset.menuOpen = '';
    else delete root.dataset.menuOpen;
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    tl?.kill();

    if (!motionEnabled()) {
      gsap.set(menu, { visibility: open ? 'visible' : 'hidden', clipPath: open ? 'none' : 'circle(0% at 100% 0%)' });
      return;
    }

    const at = origin();
    tl = gsap.timeline();
    if (open) {
      tl.set(menu, { visibility: 'visible' })
        .fromTo(menu, { clipPath: `circle(0% at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: 1, ease: 'expo.inOut' })
        .fromTo(
          links,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 },
          0.35,
        )
        .fromTo(meta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.6);
    } else {
      tl.to(links, { yPercent: -110, duration: 0.45, ease: 'power3.in', stagger: 0.03 })
        .to(menu, { clipPath: `circle(0% at ${at})`, duration: 0.8, ease: 'expo.inOut' }, 0.15)
        .set(menu, { visibility: 'hidden' });
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      toggle.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (open && window.innerWidth >= 1024) setOpen(false);
  });

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      images.forEach((image) => {
        const active = image.dataset.menuImage === link.dataset.preview;
        gsap.to(image, { opacity: active ? 1 : 0, scale: active ? 1 : 1.06, duration: 0.7, ease: 'expo.out' });
      });
    });
  });
}
