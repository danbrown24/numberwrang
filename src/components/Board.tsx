import { useRecoilState, useRecoilValue } from 'recoil';
import { candidateState, isComplete, stepsState } from '../store';
import React from 'react';
import Number from './Number';
import Step from './Step';

const Board = () => {
  const isGameComplete = useRecoilValue(isComplete);
  const candidates = useRecoilValue(candidateState);
  const [steps] = useRecoilState(stepsState);

  return (
    <>
      <div className="candidates">
        {candidates?.map((n, i) => (
          <Number number={n} key={i} />
        ))}
      </div>
      <div className="step-cont">
        {steps?.map((step, idx) => (
          <Step step={step} isLast={idx === steps.length - 1} key={idx} />
        ))}
        {isGameComplete && <div className="solved">Solved! &nbsp; 🎉</div>}
      </div>
    </>
  );
};

const BoardWrapper = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div className="board">
        <Board />
      </div>
    </React.Suspense>
  );
};

export default BoardWrapper;
