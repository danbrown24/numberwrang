import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { stepsState, numbersState, getNewNumberId, isComplete, targetState } from '../store';
import { NumberObject, operation } from '../lib/game';
import classNames from 'classnames';
import { shallowCopyNumberArrayAndModifyIndex } from '../lib/miscellaneous';

const ERROR_DURATION = 150;

interface NumberProps {
  number: NumberObject;
}

const Number = ({ number }: NumberProps) => {
  const [steps, setSteps] = useRecoilState(stepsState);
  const [numbers, setNumbers] = useRecoilState(numbersState);
  const target = useRecoilValue(targetState);
  const isGameComplete = useRecoilValue(isComplete);
  const [error, setError] = useState(false);

  const containerStyle = classNames({
    'number': true,
    'disabled': number.isUsed,
    'static': number.isStatic,
    'win': number.value === target?.value,
    'error': error,
    'small-text': number.value > 999,
  });

  return (
    <div
      className={containerStyle}
      onClick={() => {
        if (isGameComplete || number.isStatic || number.isUsed) {
          return;
        }

        const latestStep = steps[steps.length - 1];

        // If there are no steps or the latest step is full, add a new step with the value as the lhs
        if (!latestStep || latestStep.rhsNumberId) {
          const numberIdx = numbers.indexOf(number);
          setNumbers(shallowCopyNumberArrayAndModifyIndex(numbers, numberIdx, { isUsed: true }));

          return setSteps([...steps, { lhsNumberId: number.id }]);
        }

        const lhsNumber = numbers.find((n) => n.id === latestStep.lhsNumberId);

        // If the latest step has an operator chosen, add the new value as the rhs
        if (latestStep.operator && lhsNumber) {
          const opRes = operation(lhsNumber.value, latestStep.operator, number.value);

          if (opRes.valid && opRes.result) {
            const newNumber = { id: getNewNumberId(), value: opRes.result };
            const numberIdx = numbers.indexOf(number);
            setNumbers([...shallowCopyNumberArrayAndModifyIndex(numbers, numberIdx, { isUsed: true }), newNumber]); // Mark this number as used, and add the new number

            return setSteps([...steps.slice(0, -1), { ...steps.slice(-1)[0], rhsNumberId: number.id, resultNumberId: newNumber.id }]);
          }

          // Invalid operation, flash an error colour
          setError(true);
          setTimeout(() => setError(false), ERROR_DURATION);
        }
      }}
    >
      {number.value >= 0 && number.value}
    </div>
  );
};

export default Number;
