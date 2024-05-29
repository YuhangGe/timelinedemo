import type { FC } from 'react';
import { globalStore } from '../store';
import { TrackEditor } from './TrackEditor';

export const Timeline: FC = () => {
  const [tracks, setTracks] = globalStore.useStore('tracks');
  return (
    <div className='border-border flex min-h-[400px] w-full flex-shrink-0 flex-col gap-4 overflow-x-auto border-t p-4'>
      {tracks.map((track) => (
        <TrackEditor track={track} key={track.id} />
      ))}
    </div>
  );
};
