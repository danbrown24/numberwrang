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
import React, { useEffect, useRef } from 'react';

type DarkModeChangeListener = (darkMode: boolean) => void

declare global {
  // eslint-disable-next-line no-var
  var _setAppDarkMode: (darkMode: boolean) => void;
  // eslint-disable-next-line no-var
  var _registerDarkModeChangeListener: (cb: DarkModeChangeListener) => void;
  // eslint-disable-next-line no-var
  var flutter_inappwebview: undefined | { callHandler: (name: string, ...args: any[]) => void };
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
  const darkModeChangeListenersRef = useRef<DarkModeChangeListener[]>([]);
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  useEffect(() => {
    globalThis._setAppDarkMode = (darkMode: boolean) => setDarkMode(!!darkMode);
    globalThis._registerDarkModeChangeListener = (cb: DarkModeChangeListener) => {
      if (darkModeChangeListenersRef.current.length > 10) {
        throw new Error('Cannot register any more dark mode listeners');
      }
      darkModeChangeListenersRef.current.push(cb);
    };
  }, [setDarkMode]);
  
  useEffect(() => {
    darkModeChangeListenersRef.current.forEach((cb) => cb(darkMode));
    window.flutter_inappwebview?.callHandler('darkModeChangeHandler', darkMode); // Custom callback if we're embedded in a Flutter webview
  }, [darkMode]);

  return (
    <div className={classNames('app', { 'dark-mode': darkMode })} data-testid="app-main">
      <React.Suspense fallback={<></>}>
        <AppInner />
      </React.Suspense>
    </div>
  );
};

export default AppWrapper;
