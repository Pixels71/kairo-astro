import arrowDown from '@phosphor-icons/core/regular/arrow-down.svg?raw';
import arrowLeft from '@phosphor-icons/core/regular/arrow-left.svg?raw';
import arrowRight from '@phosphor-icons/core/regular/arrow-right.svg?raw';
import arrowUp from '@phosphor-icons/core/regular/arrow-up.svg?raw';
import arrowUpRight from '@phosphor-icons/core/regular/arrow-up-right.svg?raw';
import chartLineUp from '@phosphor-icons/core/regular/chart-line-up.svg?raw';
import chatsCircle from '@phosphor-icons/core/regular/chats-circle.svg?raw';
import check from '@phosphor-icons/core/regular/check.svg?raw';
import cloud from '@phosphor-icons/core/regular/cloud.svg?raw';
import creditCard from '@phosphor-icons/core/regular/credit-card.svg?raw';
import database from '@phosphor-icons/core/regular/database.svg?raw';
import envelopeSimple from '@phosphor-icons/core/regular/envelope-simple.svg?raw';
import githubLogo from '@phosphor-icons/core/regular/github-logo.svg?raw';
import kanban from '@phosphor-icons/core/regular/kanban.svg?raw';
import lifebuoy from '@phosphor-icons/core/regular/lifebuoy.svg?raw';
import linkedinLogo from '@phosphor-icons/core/regular/linkedin-logo.svg?raw';
import lockKey from '@phosphor-icons/core/regular/lock-key.svg?raw';
import minus from '@phosphor-icons/core/regular/minus.svg?raw';
import phoneCall from '@phosphor-icons/core/regular/phone-call.svg?raw';
import plus from '@phosphor-icons/core/regular/plus.svg?raw';
import shieldCheck from '@phosphor-icons/core/regular/shield-check.svg?raw';
import sparkle from '@phosphor-icons/core/regular/sparkle.svg?raw';
import x from '@phosphor-icons/core/regular/x.svg?raw';
import xLogo from '@phosphor-icons/core/regular/x-logo.svg?raw';

export const icons = {
  'arrow-down': arrowDown,
  'arrow-left': arrowLeft,
  'arrow-right': arrowRight,
  'arrow-up': arrowUp,
  'arrow-up-right': arrowUpRight,
  chart: chartLineUp,
  chat: chatsCircle,
  check,
  cloud,
  'credit-card': creditCard,
  database,
  email: envelopeSimple,
  github: githubLogo,
  kanban,
  lifebuoy,
  linkedin: linkedinLogo,
  lock: lockKey,
  minus,
  phone: phoneCall,
  plus,
  shield: shieldCheck,
  sparkle,
  x,
  'x-logo': xLogo,
};

export type IconName = keyof typeof icons;

export const iconInner = (name: IconName) => icons[name].replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
