import { useResetRecoilState } from 'recoil';
import { numbersState, stepsState } from '../../store';
import { useCallback } from 'react';

const useReset = () => {
  const resetSteps = useResetRecoilState(stepsState);
  const resetNumbers = useResetRecoilState(numbersState);

  const reset = useCallback(() => {
    resetSteps();
    resetNumbers();
  }, [resetNumbers, resetSteps]);

  return reset;
};

export default useReset;
