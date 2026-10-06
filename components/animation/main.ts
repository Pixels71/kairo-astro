import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { onIntro, releaseIntro } from '@/components/animation/intro';
import { scrollToTarget } from '@/components/animation/lenis-instance';
import playLoader from '@/components/animation/loader';
import { playArrive } from '@/components/animation/page-transition';
import initSmoothScroll from '@/components/animation/smooth-scroll';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const modules = import.meta.glob<{ default: () => void }>('./init/*.ts', { eager: true });

initSmoothScroll();
for (const module of Object.values(modules)) module.default();

const root = document.documentElement;
if (root.classList.contains('is-loading')) playLoader(releaseIntro);
else if (root.classList.contains('is-arriving')) playArrive(releaseIntro);
else releaseIntro();

const watchLayout = () => {
  const page = document.querySelector('[data-page]');
  if (!page) return;
  let measured = document.documentElement.scrollHeight;
  let timer = 0;
  ScrollTrigger.addEventListener('refresh', () => {
    measured = document.documentElement.scrollHeight;
  });
  new ResizeObserver(() => {
    if (Math.abs(document.documentElement.scrollHeight - measured) < 2) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), 180);
  }).observe(page);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
};

onIntro(() => {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  watchLayout();
  if (!window.location.hash) return;
  const target = document.querySelector<HTMLElement>(window.location.hash);
  if (target) setTimeout(() => scrollToTarget(target), 200);
});
