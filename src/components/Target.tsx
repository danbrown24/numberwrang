import { useRecoilState } from 'recoil';
import { targetState } from '../store';
import React from 'react';

const Target = () => {
  const [target] = useRecoilState(targetState);

  return <>{target && <div className="number win">{target.value}</div>}</>;
};

const TargetWrapper = () => {
  return (
    <React.Suspense fallback={<></>}>
      <div className="target">
        <Target />
      </div>
    </React.Suspense>
  );
};

export default TargetWrapper;
