import createStore from 'lrhs';
import { uid } from './util';

export interface Material {
  id: string;
  url: string;
  file: File;
  coverUrl: string;
  duration: number;
  video: HTMLVideoElement;
}
export interface Clip {
  id: string;
  material: Material;
}
export interface Track {
  id: string;
  clips: Clip[];
}
export interface GlobalStore {
  materials: Material[];
  tracks: Track[];
  preview?: Clip;
}

export const globalStore = createStore<GlobalStore>({
  materials: [],
  tracks: [
    {
      id: uid(),
      clips: [],
    },
  ],
});
