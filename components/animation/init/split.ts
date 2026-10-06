import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { onIntro } from '@/components/animation/intro';
import { $$, fontsReady, motionEnabled } from '@/utils/dom';

export default function init() {
  const headings = $$('[data-split]');
  if (!headings.length || !motionEnabled()) return;

  let introPlayed = false;
  onIntro(() => {
    introPlayed = true;
  });

  fontsReady().then(() => {
    headings.forEach((heading) => {
      const intro = heading.dataset.split === 'intro';
      SplitText.create(heading, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          gsap.set(heading, { visibility: 'visible' });
          if (intro) {
            const tween = gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.25,
              ease: 'expo.out',
              stagger: 0.1,
              paused: !introPlayed,
            });
            if (!introPlayed) onIntro(() => tween.play());
            return tween;
          }
          return gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
          });
        },
      });
    });
  });
}
