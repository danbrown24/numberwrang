import { BiSun } from 'react-icons/bi';
import { FiHelpCircle } from 'react-icons/fi';
import { HiOutlineMoon } from 'react-icons/hi';
import { useRecoilState } from 'recoil';
import { darkModeState, instructionsOpenState } from '../store';
import { useCallback, useEffect } from 'react';
import { setStoredDarkMode } from '../lib/storage';
import { setBodyClass } from '../lib';

const isFirstTitleVariant = Math.random() > 0.5;

const Header = () => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);
  const [instructionsOpen, setInstructionsOpen] = useRecoilState(instructionsOpenState);

  const titlePrefix = isFirstTitleVariant ? 'Number' : 'Wranger';
  const titleSuffix = isFirstTitleVariant ? 'wrang' : 'num';

  const onDarkModeClick = useCallback(() => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    setStoredDarkMode(newVal);
  }, [darkMode, setDarkMode]);

  const onHelpClick = useCallback(() => setInstructionsOpen(!instructionsOpen), [instructionsOpen, setInstructionsOpen]);

  useEffect(() => setBodyClass(darkMode), [darkMode]);

  return (
    <header className="header">
      <button className="header-button item" onClick={onHelpClick}>
        <FiHelpCircle size={24} color="#fff" />
      </button>
      <h1 className="title">
        {titlePrefix}
        <span className="second">{titleSuffix}</span>
      </h1>
      <button className="header-button item" onClick={onDarkModeClick}>
        {darkMode ? <BiSun size={24} color="#fff" /> : <HiOutlineMoon size={24} color="#fff" />}
      </button>
    </header>
  );
};

export default Header;
