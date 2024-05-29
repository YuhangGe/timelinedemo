import { Fragment, useState, type FC } from 'react';
import type { Track } from '../store';
import { globalStore } from '../store';
import { cs, uid } from '../util';
import { TrackEditor } from './TrackEditor';
import { ClipPreview } from './ClipPreview';

const NewTrack: FC<{
  type: 'top' | 'bottom' | 'middle';
  onAdd: (track: Track) => void;
}> = ({ type, onAdd }) => {
  const [over, setOver] = useState(false);
  return (
    <div
      className={cs(
        type === 'middle' ? 'h-5 flex-shrink-0' : 'min-h-[60px] flex-1 bg-green-100',
        type === 'top' ? 'border-b-2' : 'border-t-2',
        over ? 'border-red-500' : 'border-transparent',
      )}
      onDragOverCapture={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
      }}
      onDragEnterCapture={() => {
        setOver(true);
      }}
      onDragLeaveCapture={() => {
        setOver(false);
      }}
      onDropCapture={(evt) => {
        setOver(false);
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
          onAdd({ id: uid(), clips: [v] });
        } else {
          if (!drag.track || !drag.clip) return;
          const i = drag.track.clips.indexOf(drag.clip);
          drag.track.clips.splice(i, 1);
          const d = evt.pageX - (drag.px ?? 0);
          let nl = (drag.pl ?? 0) + d;
          if (nl < 0) nl = 0;
          drag.clip.left = nl;
          onAdd({ id: uid(), clips: [drag.clip] });
        }
      }}
    ></div>
  );
};
export const Timeline: FC = () => {
  const [tracks, setTracks] = globalStore.useStore('tracks');
  return (
    <div className='flex flex-1 flex-col overflow-hidden'>
      <ClipPreview />
      <div className='border-border flex min-h-[30%] w-full flex-shrink-0 flex-col overflow-x-auto border-t px-4'>
        <NewTrack
          type='top'
          onAdd={(t) => {
            setTracks([t, ...tracks]);
            globalStore.set('activeClip', t.clips[0]);
          }}
        />
        {tracks.map((track, i) => (
          <Fragment key={track.id}>
            <TrackEditor track={track} key={track.id} />
            {i < tracks.length - 1 && (
              <NewTrack
                type='middle'
                onAdd={(t) => {
                  const newTracks = tracks.slice();
                  newTracks.splice(i + 1, 0, t);
                  setTracks(newTracks);
                  globalStore.set('activeClip', t.clips[0]);
                }}
              />
            )}
          </Fragment>
        ))}
        <NewTrack
          type='bottom'
          onAdd={(t) => {
            setTracks([...tracks, t]);
            globalStore.set('activeClip', t.clips[0]);
          }}
        />
      </div>
    </div>
  );
};
