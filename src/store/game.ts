import { atom, selector } from 'recoil';
import { getTodaysCandidates, getTodaysTarget } from '../lib';
import { NumberObject, Step } from '../lib/game';

let lastNumberId = 0; // Start with 0 so all ids will be truthy

export const getNewNumberId = () => ++lastNumberId;

export const targetState = atom({
  key: 'Target',
  default: getTodaysTarget(),
});

export const numbersState = atom({
  key: 'Numbers',
  default: getTodaysCandidates().then((candidates) =>
    candidates.map((n) => ({
      id: getNewNumberId(),
      value: n,
      isCandidate: true,
    }))
  ) as Promise<NumberObject[]>,
});

export const candidateState = selector({
  key: 'Candidates',
  get: ({ get }) => {
    const numbers = get(numbersState);
    return numbers.filter((n) => n.isCandidate);
  },
});

export const stepsState = atom({
  key: 'Steps',
  default: [] as Step[],
});

export const isComplete = selector({
  key: 'Complete',
  get: ({ get }) => {
    const steps = get(stepsState);
    const numbers = get(numbersState);
    const target = get(targetState);
    const lastStepResultNumberId = steps[steps.length - 1]?.resultNumberId;

    return target && lastStepResultNumberId && numbers.find((n) => n.id === lastStepResultNumberId)?.value === target.value;
  },
});
