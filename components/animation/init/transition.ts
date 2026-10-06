import { scrollToTarget } from '@/components/animation/lenis-instance';
import { leavePage, resetTransition } from '@/components/animation/page-transition';
import { routeLabels } from '@/data/navbar';
import { site } from '@/data/site';

const labelFor = (link: HTMLAnchorElement, url: URL) => {
  if (link.dataset.label) return link.dataset.label;
  const path = url.pathname.replace(/\/$/, '') || '/';
  return routeLabels[path] ?? routeLabels[`/${path.split('/')[1]}`] ?? site.name;
};

export default function init() {
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download') || link.dataset.noTransition !== undefined)
      return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) return;

    event.preventDefault();
    document.dispatchEvent(new CustomEvent('kairo:navigate'));

    if (url.pathname === window.location.pathname) {
      if (url.search !== window.location.search) {
        history.replaceState(null, '', url.pathname + url.search + url.hash);
        document.dispatchEvent(new CustomEvent('kairo:url'));
      }
      const target = url.hash ? document.querySelector<HTMLElement>(url.hash) : null;
      scrollToTarget(target ?? 0);
      return;
    }

    leavePage(url, labelFor(link, url), event.clientX > window.innerWidth / 2);
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) resetTransition();
  });
}
