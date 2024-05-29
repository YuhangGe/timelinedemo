import type { FC } from 'react';
import { globalStore } from './store';

export const VideoPreview: FC = () => {
  const [clip] = globalStore.useStore('preview');

  return (
    <div className='flex-1'>
      {clip && (
        <video
          src={clip.material.url}
          controls
          autoPlay
          className='h-full w-full object-contain'
          muted
        />
      )}
    </div>
  );
};
