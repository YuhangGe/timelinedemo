import type { FC } from 'react';
import { Side } from './Side';
import { Timeline } from './Timeline';

export const App: FC = () => {
  return (
    <div className='flex h-full w-full'>
      <Side />
      <Timeline />
    </div>
  );
};
