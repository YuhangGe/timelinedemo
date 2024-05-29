import type { MouseEvent as ReactMouseEvent, FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Track, Clip } from '../store';
import { globalStore } from '../store';
import { cs, loadVideoImage, uid } from '../util';

const Resizer: FC<{
  type: 'left' | 'right';
  clip: Clip;
  onMove: (x: number, y: number) => void;
}> = ({ type, clip, onMove }) => {
  const el = useRef<HTMLDivElement>(null);
  const x = useRef({
    d: 0,
    dl: 0,
    dt: 0,
  });

  const onMouseMove = useCallback((evt: MouseEvent) => {
    if (!el.current?.parentElement) return;
    const de = evt.pageX - x.current.d;
    const td = de / 10;
    if (type === 'left') {
      const nt = x.current.dt + td;
      const nl = x.current.dl + de;
      if (nt < 0 || nl < 0) {
        return;
      }
      onMove(nt, nl);
    } else {
      const nt = x.current.dt + td;
      if (nt > clip.material.duration) {
        return;
      }
      onMove(nt, 0);
    }
  }, []);
  const onMouseUp = useCallback(() => {
    document.documentElement.removeEventListener('mousemove', onMouseMove, { capture: true });
    document.documentElement.removeEventListener('mouseup', onMouseUp, { capture: true });
  }, []);
  const onMouseDown = useCallback((evt: ReactMouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    if (!el.current?.parentElement) return;
    const k = x.current;
    k.d = evt.pageX;
    k.dl = el.current.parentElement.offsetLeft;
    k.dt = type === 'left' ? clip.startAt : clip.endAt;
    document.documentElement.addEventListener('mousemove', onMouseMove, { capture: true });
    document.documentElement.addEventListener('mouseup', onMouseUp, { capture: true });
  }, []);
  return (
    <div
      ref={el}
      onMouseDown={onMouseDown}
      className={cs(
        'absolute top-0 z-20 flex h-full w-5 cursor-col-resize items-center justify-center bg-blue-500 bg-opacity-60',
        type === 'left' ? 'left-0' : 'right-0',
      )}
    >
      <span className='icon-[material-symbols--menu] text-white'></span>
    </div>
  );
};
const LazyImage: FC<{ clip: Clip; timeAt: number }> = ({ clip, timeAt }) => {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    void loadVideoImage(clip.material.video, timeAt).then((u) => {
      if (u && el.current) {
        el.current.innerHTML = '';
        el.current.appendChild(u);
      }
    });
  }, [clip, timeAt]);
  return <div className='h-full w-[50px]' ref={el}></div>;
};
export const ClipEditor: FC<{ clip: Clip; track: Track; onRm: () => void }> = ({
  clip,
  track,
  onRm,
}) => {
  const W = useMemo(() => clip.material.duration * 10, [clip]);
  const [activeClip, setActiveClip] = globalStore.useStore('activeClip');

  const [startAt, setStartAt] = useState(clip.startAt);
  const [endAt, setEndAt] = useState(clip.endAt);
  const [left, setLeft] = useState(clip.left ?? 0);

  const ia = useMemo(() => {
    const pn = Math.ceil(W / 50);
    return new Array(pn).fill(0).map((_, i) => {
      return { id: uid(), timeAt: i * 50 * (1 / 10) };
    });
  }, [clip]);

  const el = useRef<HTMLDivElement>(null);
  // 出于对代码版权的保护，变量名就不认真取了。
  const x = useRef({
    d: 0,
    dl: 0,
  });
  const onMouseMove = useCallback((evt: MouseEvent) => {
    if (!el.current) return;
    const de = evt.pageX - x.current.d;
    let nl = x.current.dl + de;
    if (nl < 0) nl = 0;
    setLeft(nl);
  }, []);
  const onMouseUp = useCallback(() => {
    document.documentElement.removeEventListener('mousemove', onMouseMove, { capture: true });
    document.documentElement.removeEventListener('mouseup', onMouseUp, { capture: true });
  }, []);
  const onMouseDown = useCallback((evt: ReactMouseEvent) => {
    if (!el.current) return;
    const k = x.current;
    k.d = evt.pageX;
    k.dl = el.current.offsetLeft;
    document.documentElement.addEventListener('mousemove', onMouseMove, { capture: true });
    document.documentElement.addEventListener('mouseup', onMouseUp, { capture: true });
  }, []);

  const w = (endAt - startAt) * 10;
  const t = -startAt * 10;
  const active = clip.id === activeClip?.id;
  return (
    <div
      ref={el}
      className='absolute top-0 h-full overflow-hidden rounded-xl bg-purple-100'
      style={{
        left: left,
        width: w,
      }}
    >
      <div
        className='flex h-full'
        style={{
          width: W,
          transform: `translateX(${t}px)`,
        }}
      >
        {ia.map((ii) => (
          <LazyImage key={ii.id} clip={clip} timeAt={ii.timeAt} />
        ))}
      </div>
      {active ? (
        <>
          <Resizer
            clip={clip}
            type='left'
            onMove={(ta, nl) => {
              clip.startAt = ta;
              setStartAt(ta);
              setLeft(nl);
              setActiveClip({ ...clip });
            }}
          />
          <Resizer
            clip={clip}
            type='right'
            onMove={(ta) => {
              clip.endAt = ta;
              setEndAt(ta);
              setActiveClip({ ...clip });
            }}
          />

          <div
            draggable
            onDragStartCapture={(evt) => {
              if (!el.current) return;
              const rect = el.current.getBoundingClientRect();
              const rx = evt.pageX - rect.left;
              const ry = evt.pageY - rect.top;
              // const $el = (evt.target as HTMLDivElement).parentElement as HTMLDivElement;
              globalStore.set('drag', {
                type: 'c',
                track,
                clip,
                px: evt.pageX,
                pl: left,
              });
              evt.dataTransfer.setDragImage(el.current, rx, ry);
              evt.dataTransfer.dropEffect = 'move';
              setTimeout(() => {
                if (!el.current) return;
                el.current.style.opacity = '0';
              });
            }}
            onDragEndCapture={(evt) => {
              if (!el.current) return;
              // console.log('endddd', evt.currentTarget);
              if (!track.clips.some((c) => c.id === clip.id)) {
                onRm();
              } else {
                el.current.style.opacity = '1';
                const drag = globalStore.get('drag');
                if (!drag) return;
                const d = evt.pageX - (drag.px ?? 0);
                setLeft((v) => {
                  const nl = v + d;
                  if (nl < 0) return v;
                  return nl;
                });
              }
            }}
            className='absolute left-0 top-0 z-10 h-full w-full  cursor-move rounded-xl border-2 border-blue-500'
          ></div>
        </>
      ) : (
        <div
          onClick={() => {
            if (!active) {
              setActiveClip({ ...clip });
            }
          }}
          className='absolute left-0 top-0 z-10 h-full w-full cursor-pointer rounded-xl'
        ></div>
      )}
    </div>
  );
};
