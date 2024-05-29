import { useState, type FC } from 'react';
import type { Clip, Track } from '../store';
import { globalStore } from '../store';
import { uid } from '../util';

export const TrackEditor: FC<{ track: Track }> = ({ track }) => {
  const [clips, setClips] = useState<Clip[]>(track.clips);

  return (
    <div
      onDropCapture={(evt) => {
        const id = evt.dataTransfer.getData('text/plain');
        const material = globalStore.get('materials').find((m) => m.id === id);
        if (!material) return;
        setClips([
          ...clips,
          {
            id: uid(),
            material,
          },
        ]);
      }}
      onDragOverCapture={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
      }}
      className='h-[50px] w-[1280px] rounded-md bg-gray-400'
    >
      {
        //
      }
    </div>
  );
};
