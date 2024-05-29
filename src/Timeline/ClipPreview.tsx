import { useEffect, useRef, useState, type FC } from 'react';
import { Button } from 'antd';
import { globalStore } from '../store';

export const ClipPreview: FC = () => {
  const [clip] = globalStore.useStore('activeClip');
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!video.current || !clip) return;
    setPlaying(false);
    video.current.pause();
    video.current.src = clip.material.url;
    video.current.currentTime = clip.startAt;
    video.current.ontimeupdate = () => {
      if (!video.current) return;
      if (video.current.currentTime >= clip.endAt) {
        video.current.pause();
      }
    };
    video.current.onended = () => {
      setPlaying(false);
    };
  }, [clip]);
  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center overflow-hidden'>
      <div className='h-[300px] w-[300px] border border-blue-50'>
        <video ref={video} controls={false} className='h-full w-full object-contain' />
      </div>
      <div className='my-1 flex items-center justify-center'>
        <Button
          size='small'
          onClick={() => {
            if (!video.current || !clip) return;
            if (playing) {
              void video.current.pause();
            } else {
              video.current.currentTime = clip.startAt;
              void video.current.play();
            }
            setPlaying(!playing);
          }}
        >
          {playing ? 'Stop' : 'Play'}
        </Button>
        {clip && (
          <span className='ml-2'>
            {clip.startAt.toFixed(2)} - {clip.endAt.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
};
