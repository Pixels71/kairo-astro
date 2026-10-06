import 'number-flow';
import type NumberFlow from 'number-flow';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onIntro } from '@/components/animation/intro';
import { $$, motionEnabled } from '@/utils/dom';

export type Flow = NumberFlow;

const label = (flow: NumberFlow, value: number) => {
  const d = flow.dataset;
  const decimals = Number(d.decimals ?? 0);
  const text = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: d.grouping !== 'false',
  });
  flow.setAttribute('aria-label', `${flow.numberPrefix ?? ''}${text}${flow.numberSuffix ?? ''}`);
};

export const setFlow = (flow: NumberFlow, value: number, affix?: { prefix?: string; suffix?: string }) => {
  if (affix?.prefix !== undefined) flow.numberPrefix = affix.prefix;
  if (affix?.suffix !== undefined) flow.numberSuffix = affix.suffix;
  flow.dataset.value = String(value);
  flow.update(value);
  label(flow, value);
};

const configure = (flow: NumberFlow) => {
  const d = flow.dataset;
  const decimals = Number(d.decimals ?? 0);
  const ms = Number(d.duration ?? 1.8) * 1000;
  flow.textContent = '';
  flow.numberPrefix = d.prefix ?? '';
  flow.numberSuffix = d.suffix ?? '';
  flow.format = {
    useGrouping: d.grouping !== 'false',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };
  flow.trend = 0;
  flow.transformTiming = { duration: ms, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
  flow.spinTiming = { duration: ms, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' };
  flow.opacityTiming = { duration: Math.max(250, ms * 0.45), easing: 'ease-out' };
};

export default function init() {
  const animate = motionEnabled();
  $$<NumberFlow>('[data-number-flow]').forEach((flow) => {
    configure(flow);
    const d = flow.dataset;
    const value = Number(d.value);

    if (!animate) {
      flow.animated = false;
      flow.update(value);
      return;
    }

    flow.animated = false;
    flow.update(d.trigger === 'manual' ? value : Number(d.from ?? 0));
    flow.animated = true;
    if (d.trigger === 'manual') return;

    const play = () => gsap.delayedCall(Number(d.delay ?? 0), () => flow.update(Number(d.value)));
    onIntro(() => {
      if (d.trigger === 'load') play();
      else ScrollTrigger.create({ trigger: flow, start: 'top 92%', once: true, onEnter: play });
    });
  });
}
