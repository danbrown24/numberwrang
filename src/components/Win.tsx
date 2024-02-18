import { useRecoilState, useRecoilValue } from 'recoil';
import { candidateState, stepsState, targetState } from '../store';
import { useCallback, useEffect, useState } from 'react';
import useReset from '../lib/hooks/useReset';
import React from 'react';
import Modal from './Modal';
import { IoIosRefresh } from 'react-icons/io';
import { BsShareFill } from 'react-icons/bs';

const SHARE_NOTIFICATION_DURATION = 2000;

const Win = () => {
  const reset = useReset();
  const [, setIsOpen] = useState(false);
  const candidates = useRecoilValue(candidateState);
  const target = useRecoilValue(targetState);
  const [steps] = useRecoilState(stepsState);
  const [showShared, setShowShared] = useState(false);

  /**
   * Side effect to flash the "copied to clipboard" message when the share button is clicked
   */
  useEffect(() => {
    const timeout = setTimeout(() => setIsOpen(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  const fastestSolutionStepCount = target?.solveResult.fewestSteps;
  const isFastestSolution = fastestSolutionStepCount === steps.length;

  const onShare = useCallback(async () => {
    setShowShared(true);
    setTimeout(() => setShowShared(false), SHARE_NOTIFICATION_DURATION);
    try {
      const resultText = `Numberwrang ${new Date().toLocaleString().slice(0, 5)}

${candidates.map((n) => (n.isUsed ? '🟩 ' : '⬜️ ')).join('')}
${steps.length} steps`;

      await navigator.clipboard.writeText(resultText);
    } catch (err) {
      console.error('Failed to copy results to clipboard: ', err);
    }
  }, [candidates, steps.length]);

  return (
    <Modal initialShowDelay={600} closeOnBackdropClick={false}>
      <h2 className="">Solved! 🎉</h2>
      <div className="share-container">
        {showShared ? (
          <div className="shared-text">Results copied to clipboard!</div>
        ) : (
          <button className="share-button" onClick={onShare}>
            <span>Share</span> <BsShareFill size={18} color="#fff" />
          </button>
        )}
      </div>
      <p className="">
        There are at least <b>{target?.solveResult.solutions.length}</b> different solutions.
      </p>
      {isFastestSolution ? (
        <>
          <p className="">Congratulations, there are no faster solutions!</p>
        </>
      ) : (
        <>
          <p className="">
            The fastest solution is in <b>{fastestSolutionStepCount}</b> steps, using <b>{target?.solveResult.fewestStepSolutions[0].numbersUsed}</b>{' '}
            numbers.
          </p>
        </>
      )}
      <p>
        <span className="">Fancy another go?</span>
        <button className="retry-button" onClick={() => reset()}>
          <span>Retry</span> <IoIosRefresh size={18} color="#fff" />
        </button>
      </p>
      <p className="">Come back tomorrow for a new puzzle!</p>
    </Modal>
  );
};

const WinWrapper = () => {
  return (
    <React.Suspense fallback={<></>}>
      <Win />
    </React.Suspense>
  );
};

export default WinWrapper;
