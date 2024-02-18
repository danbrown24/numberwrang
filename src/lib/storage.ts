import { Operator } from './miscellaneous';

export enum StorageKey {
  DARK_MODE = 'darkMode',
  FIRST_RUN_DONE = 'firstRunDone',
  SOLUTIONS = 'solutions',
}

export const getStoredDarkMode = () => localStorage.getItem(StorageKey.DARK_MODE) === 'true';
export const setStoredDarkMode = (darkMode: boolean) => localStorage.setItem(StorageKey.DARK_MODE, darkMode.toString());

export const getStoredFirstRunDone = () => localStorage.getItem(StorageKey.FIRST_RUN_DONE) === 'true';
export const setStoredFirstRunDone = (done: boolean) => localStorage.setItem(StorageKey.FIRST_RUN_DONE, done.toString());

interface Solutions {
  [date: number]: [number, Operator, number][];
}

export const getStoredSolutions = () => {
  try {
    const stored = localStorage.getItem(StorageKey.SOLUTIONS);
    return stored ? (JSON.parse(stored) as Solutions) : null;
  } catch (err) {
    return null;
  }
};
export const setStoredSolutions = (steps: Solutions) => localStorage.setItem(StorageKey.SOLUTIONS, JSON.stringify(steps));

console.log('Stored solutions are', getStoredSolutions());
