import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { setLenis } from '@/components/animation/lenis-instance';
import { motionEnabled } from '@/utils/dom';

export default function initSmoothScroll() {
  if (!motionEnabled()) return;
  const lenis = new Lenis({ duration: 1.15, autoRaf: false });
  setLenis(lenis);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
