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

onIntro(() => {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
  if (!window.location.hash) return;
  const target = document.querySelector<HTMLElement>(window.location.hash);
  if (target) setTimeout(() => scrollToTarget(target), 200);
});
