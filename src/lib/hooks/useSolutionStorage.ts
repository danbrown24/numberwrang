import { useRecoilState, useRecoilValue } from 'recoil';
import { candidateState, getNewNumberId, isComplete, numbersState, stepsState, targetState } from '../../store';
import { useCallback, useEffect } from 'react';
import { Step as StepType, operation, stepsToJson } from '../../lib/game';
import { getStoredSolutions, setStoredSolutions } from '../../lib/storage';
import { getTodaysDate } from '../../lib/generate';
import { shallowCopyNumberArrayAndModifyIndex } from '../../lib/miscellaneous';
import useReset from './useReset';

const useSolutionStorage = () => {
  const candidates = useRecoilValue(candidateState);
  const target = useRecoilValue(targetState);
  const [numbers, setNumbers] = useRecoilState(numbersState);
  const [steps, setStepState] = useRecoilState(stepsState);
  const isGameComplete = useRecoilValue(isComplete);
  const reset = useReset();

  const saveSolution = useCallback(() => {
    const stepsShort = stepsToJson(steps, numbers);
    console.log('Saving steps state =', stepsShort);
    const storedSolutions = getStoredSolutions();
    setStoredSolutions({ ...storedSolutions, [getTodaysDate()]: stepsShort });
  }, [numbers, steps]);

  const restoreSolution = useCallback(() => {
    const storedSolution = getStoredSolutions()?.[getTodaysDate()];

    if (storedSolution) {
      let numbers = [...candidates];
      let lastResult = -1;

      const steps = storedSolution.map((step) => {
        const [lhs, operator, rhs] = step;

        const lhsNumber = numbers.find((n) => n.value === lhs) || numbers[numbers.push({ id: getNewNumberId(), value: lhs }) - 1];
        numbers = shallowCopyNumberArrayAndModifyIndex(numbers, numbers.indexOf(lhsNumber), { isUsed: true });
        const rhsNumber = numbers.find((n) => n.value === rhs) || numbers[numbers.push({ id: getNewNumberId(), value: rhs }) - 1];
        numbers = shallowCopyNumberArrayAndModifyIndex(numbers, numbers.indexOf(rhsNumber), { isUsed: true });
        const resultNumber = numbers[numbers.push({ id: getNewNumberId(), value: operation(lhs, operator, rhs).result }) - 1];
        lastResult = resultNumber.value;

        return {
          lhsNumberId: lhsNumber.id,
          operator,
          rhsNumberId: rhsNumber.id,
          resultNumberId: resultNumber.id,
        } as StepType;
      });

      if (lastResult !== target?.value) {
        console.warn('Saved solution does not match the target, resetting.');
        // TODO: Clear it
        reset();
      } else {
        setNumbers(numbers);
        setStepState(steps);
      }
    }
  }, [candidates, reset, setNumbers, setStepState, target]);

  /**
   * Side effect to save the new solution whenever the game is complete
   */
  useEffect(() => {
    if (isGameComplete) {
      saveSolution();
    }
  }, [isGameComplete, saveSolution]);

  /**
   * Side effect to restore the user's previous solution, if one exists
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => restoreSolution(), []);

  return {
    saveSolution,
    restoreSolution,
  };
};

export default useSolutionStorage;
