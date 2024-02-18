import Header from './components/Header';
import './styles.scss';
import classNames from 'classnames';
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState, instructionsOpenState, isComplete } from './store';
import { initFirebase } from './lib/firebase';
import Instructions from './components/Instructions';
import { setBodyClass } from './lib';
import Game from './components/Game';
import Win from './components/Win';
import React, { useEffect } from 'react';

declare global {
  // eslint-disable-next-line no-var
  var _setAppDarkMode: (darkMode: boolean) => void;
}

initFirebase();
setBodyClass();

const AppInner = () => {
  const [instructionsOpen] = useRecoilState(instructionsOpenState);
  const winOpen = useRecoilValue(isComplete);

  return (
    <>
      <Header />
      <Game />
      {instructionsOpen && <Instructions />}
      {winOpen && <Win />}
    </>
  );
};

const AppWrapper = () => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  useEffect(() => {
    globalThis._setAppDarkMode = (darkMode: boolean) => setDarkMode(!!darkMode);
  }, [setDarkMode]);

  return (
    <div className={classNames('app', { 'dark-mode': darkMode })} data-testid="app-main">
      <React.Suspense fallback={<></>}>
        <AppInner />
      </React.Suspense>
    </div>
  );
};

export default AppWrapper;
