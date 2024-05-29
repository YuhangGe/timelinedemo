import { useState, type FC } from 'react';
import type { Clip, Track } from '../store';
import { globalStore } from '../store';
import { uid } from '../util';
import { ClipEditor } from './ClipEditor';

export const TrackEditor: FC<{ track: Track }> = ({ track }) => {
  const [clips, setClips] = useState<Clip[]>(track.clips);
  return (
    <div
      onDropCapture={(evt) => {
        const drag = globalStore.get('drag');
        if (!drag) return;
        if (drag.type === 'm') {
          if (!drag.material) return;
          const v = {
            id: uid(),
            material: drag.material,
            startAt: 0,
            endAt: drag.material.duration,
          };
          const newClips = [...clips, v];
          setClips(newClips);
          track.clips.push(v);
          globalStore.set('activeClip', { ...v });
        } else {
          if (!drag.track || !drag.clip) return;
          if (drag.track.id === track.id) {
            //
          } else {
            const i = drag.track.clips.indexOf(drag.clip);
            drag.track.clips.splice(i, 1);
            track.clips.push(drag.clip);
            const d = evt.pageX - (drag.px ?? 0);
            let nl = (drag.pl ?? 0) + d;
            if (nl < 0) nl = 0;
            drag.clip.left = nl;
            setClips([...clips, drag.clip]);
          }
        }
      }}
      onDragOverCapture={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
      }}
      className='relative h-[50px] w-[1280px] rounded-xl bg-gray-400'
    >
      {clips.map((clip) => (
        <ClipEditor
          key={clip.id}
          clip={clip}
          track={track}
          onRm={() => {
            const newClips = clips.slice();
            setClips(newClips);
          }}
        />
      ))}
    </div>
  );
};
