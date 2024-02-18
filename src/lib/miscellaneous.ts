import { NumberObject } from './game';
import { getStoredDarkMode } from './storage';

export type Operator = '+' | '-' | '*' | '/';

export const shallowCopyNumberArrayAndModifyIndex = (arr: NumberObject[], i: number, mods: Partial<NumberObject>) => {
  return [...arr.slice(0, i), { ...arr[i], ...mods }, ...arr.slice(i + 1)];
};

const initialDarkMode = getStoredDarkMode();

export const setBodyClass = (newDarkMode = initialDarkMode) => {
  document.body.classList.toggle('dark-mode', newDarkMode);
};
