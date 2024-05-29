import { Button, Upload } from 'antd';
import { type FC } from 'react';
import { loadVideoImage, loadVideo, uid } from './util';
import { globalStore } from './store';

export const Side: FC = () => {
  const [files, setFiles] = globalStore.useStore('materials');
  const handleOpen = async (file: File) => {
    const url = URL.createObjectURL(file);
    const v = await loadVideo(url);
    const coverUrl = await loadVideoImage(v, 0);
    if (!coverUrl) return;
    const f = {
      id: uid(),
      url,
      file,
      video: v,
      duration: Math.floor(v.duration),
      coverUrl,
    };
    setFiles([...files, f]);
  };
  return (
    <div className='border-border flex h-full w-[320px] flex-shrink-0 flex-col border-r p-8'>
      <Upload
        fileList={[]}
        beforeUpload={(file) => {
          void handleOpen(file);

          return false;
        }}
        accept='.mp4'
        className='w-full [&_.ant-upload-select]:w-full'
      >
        <Button type='primary' className='w-full'>
          上传素材
        </Button>
      </Upload>
      {!files.length && (
        <div className='mt-8 text-center text-sm text-slate-500'>暂无素材，请上传</div>
      )}
      <div className='flex w-full flex-wrap justify-between'>
        {files.map((f) => (
          <div
            key={f.id}
            draggable
            onDragStartCapture={(evt) => {
              evt.dataTransfer.setData('text/plain', f.id);
              evt.dataTransfer.dropEffect = 'copy';
            }}
            className='relative h-[160px] w-[120px] cursor-pointer hover:bg-blue-100'
          >
            <img src={f.coverUrl} className='h-full w-full object-contain' />
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white'>
              {f.duration}秒
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
