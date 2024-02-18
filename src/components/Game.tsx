import Target from '../components/Target';
import Board from '../components/Board';
import { initFirebase } from '../lib/firebase';
import { setBodyClass } from '../lib';
import useSolutionStorage from '../lib/hooks/useSolutionStorage';
import React from 'react';

initFirebase();
setBodyClass();

const Game = () => {
  useSolutionStorage();

  return (
    <div className="game">
      <Target />
      <Board />
    </div>
  );
};

const GameWrapper = () => {
  return (
    <React.Suspense fallback={<></>}>
      <div className="content">
        <Game />
      </div>
    </React.Suspense>
  );
};

export default GameWrapper;
