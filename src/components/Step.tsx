import { useRecoilState, useSetRecoilState } from 'recoil';
import { numbersState, stepsState } from '../store';
import { useCallback } from 'react';
import Number from './Number';
import { Operator, shallowCopyNumberArrayAndModifyIndex } from '../lib';
import { MdRemoveCircleOutline } from 'react-icons/md';
import OperatorIcon from './OperatorIcon';
import { Step as StepType } from '../lib/game';

const OperatorSelection = () => {
  const setSteps = useSetRecoilState(stepsState);

  const onClick = useCallback(
    (operator: Operator) => {
      setSteps((steps) => {
        return [...steps.slice(0, -1), { ...steps.slice(-1)[0], operator }];
      });
    },
    [setSteps]
  );

  return (
    <div className="operator-select">
      <div className="operator-option" onClick={() => onClick('+')}>
        <OperatorIcon operator="+" />
      </div>
      <div className="operator-option" onClick={() => onClick('-')}>
        <OperatorIcon operator="-" />
      </div>
      <div className="operator-option" onClick={() => onClick('/')}>
        <OperatorIcon operator="/" />
      </div>
      <div className="operator-option" onClick={() => onClick('*')}>
        <OperatorIcon operator="*" />
      </div>
    </div>
  );
};

interface StepProps {
  step: StepType;
  isLast: boolean;
}

const Step = ({ step, isLast = false }: StepProps) => {
  const [numbers, setNumbers] = useRecoilState(numbersState);
  const [steps, setSteps] = useRecoilState(stepsState);

  const lhsNumber = numbers.find((n) => n.id === step.lhsNumberId);
  const rhsNumber = numbers.find((n) => n.id === step.rhsNumberId);
  const resultNumber = numbers.find((n) => n.id === step.resultNumberId);

  const deleteLastStep = useCallback(() => {
    const lastStep = steps[steps.length - 1];

    const lhsNumberIdx = numbers.findIndex((n) => n.id === lastStep.lhsNumberId);
    let newNumbers = shallowCopyNumberArrayAndModifyIndex(numbers, lhsNumberIdx, { isUsed: false });

    if (lastStep.rhsNumberId) {
      const rhsNumberIdx = newNumbers.findIndex((n) => n.id === lastStep.rhsNumberId);
      newNumbers = shallowCopyNumberArrayAndModifyIndex(newNumbers, rhsNumberIdx, { isUsed: false });
    }
    setNumbers(newNumbers); // Mark these numbers as not used
    setSteps([...steps.slice(0, -1)]); // Remove the last step
  }, [numbers, setNumbers, setSteps, steps]);

  return (
    <>
      <div className="step">
        {isLast ? (
          <div className="delete" onClick={deleteLastStep}>
            <MdRemoveCircleOutline size={24} color="red" />
          </div>
        ) : (
          <div className="spacer" />
        )}
        {lhsNumber && <Number number={{ ...lhsNumber, isStatic: true }} />}
        {step.operator ? (
          <div className="operator">
            <OperatorIcon operator={step.operator} />
          </div>
        ) : (
          <OperatorSelection />
        )}
        {rhsNumber && <Number number={{ ...rhsNumber, isStatic: true }} />}
        {rhsNumber && (
          <div className="operator">
            <OperatorIcon operator="=" />
          </div>
        )}
        {resultNumber && <Number number={resultNumber} />}
      </div>
    </>
  );
};

export default Step;
