import { useRecoilState } from 'recoil';
import { darkModeState } from '../store';
import { Operator } from '../lib';
import { FaDivide, FaEquals, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';

const OperatorIcon = ({ operator }: { operator: Operator | '=' }) => {
  const [darkMode] = useRecoilState(darkModeState);
  const commonProps = { size: 16, color: darkMode ? '#ccc' : '#222' };

  switch (operator) {
    case '*':
      return <FaTimes {...commonProps} />;
    case '/':
      return <FaDivide {...commonProps} />;
    case '+':
      return <FaPlus {...commonProps} />;
    case '-':
      return <FaMinus {...commonProps} />;
    case '=':
      return <FaEquals {...commonProps} />;
  }
};

export default OperatorIcon;
