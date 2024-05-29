import type { FC } from 'react';
import { Side } from './Side';
import { Timeline } from './Timeline';
import { VideoPreview } from './ClipPreview';

export const App: FC = () => {
  return (
    <div className='flex h-full w-full'>
      <Side />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <VideoPreview />
        <Timeline />
      </div>
    </div>
  );
};
