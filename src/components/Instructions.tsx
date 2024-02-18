import { useRecoilState } from 'recoil';
import { instructionsOpenState } from '../store';
import { useCallback } from 'react';
import OperatorIcon from './OperatorIcon';
import { setStoredFirstRunDone } from '../lib/storage';
import Modal from './Modal';

const Instructions = () => {
  const setInstructionsOpen = useRecoilState(instructionsOpenState)[1];

  const onClosed = useCallback(() => {
    setStoredFirstRunDone(true);
    setInstructionsOpen(false);
  }, [setInstructionsOpen]);

  return (
    <Modal onClose={onClosed}>
      <h2>How to Play</h2>
      <p className="">Make the gold number using any of the green numbers. You don&apos;t have to use them all.</p>
      <p className="">
        You can add, subtract, multiply and divide any two green numbers to make a new green number, provided that the result is a whole and positive
        number, and below 10,000.{' '}
      </p>
      <div className="step">
        <div className="number static">{50}</div>
        <div className="operator">
          <OperatorIcon operator={'/'} />
        </div>
        <div className="number static">{5}</div>
        <div className="operator">
          <OperatorIcon operator={'='} />
        </div>
        <div className="number">{20}</div>
      </div>
      <p className="">A new puzzle is released every day.</p>
    </Modal>
  );
};

export default Instructions;
