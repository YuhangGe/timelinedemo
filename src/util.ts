export function uid() {
  return Date.now().toString(32) + Math.floor(Math.random() * 0xffff).toString(32);
}
export function isNum(v: unknown): v is number {
  return typeof v === 'number';
}
export function isStr(v: unknown): v is string {
  return typeof v === 'string';
}
export function isObj<T = Record<string, unknown>>(v: unknown): v is T {
  return typeof v === 'object' && v !== null;
}
export function isUndefined(v: unknown): v is undefined {
  return typeof v === 'undefined';
}
export function cs(...args: (string | Record<string, boolean> | boolean | null | undefined)[]) {
  const segs: string[] = [];
  args.forEach((arg) => {
    if (isObj(arg)) {
      Object.keys(arg).forEach((k) => {
        if (arg[k]) {
          segs.push(k.trim());
        }
      });
    } else if (isStr(arg) && arg.trim()) {
      segs.push(arg);
    }
  });
  return segs.join(' ');
}

interface Job {
  v: HTMLVideoElement;
  r: (u: HTMLImageElement | null) => void;
  t: number;
}
const queue: Job[] = [];
let b = false;
function schedule() {
  if (b) return;
  if (!queue.length) return;
  const j = queue.shift();
  if (!j) return;
  b = true;
  doLoad(j);
}
const cache = new Map<HTMLVideoElement, Map<number, HTMLImageElement>>();

function doLoad({ v, r, t }: Job) {
  const m = cache.get(v);
  const img = m?.get(t);
  if (img) {
    r(img);
    b = false;
    schedule();
    return;
  }

  v.currentTime = t;

  v.onseeked = function () {
    const canvas = document.createElement('canvas');
    canvas.height = v.videoHeight;
    canvas.width = v.videoWidth;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      const img = document.createElement('img');
      img.src = canvas.toDataURL();
      img.className = 'w-full h-full object-cover';
      img.onload = () => {
        let m = cache.get(v);
        if (!m) {
          cache.set(v, (m = new Map()));
        }
        m.set(t, img);
        r(img);
      };
    } else {
      r(null);
    }
    b = false;
    schedule();
  };
}
export function loadVideoImage(v: HTMLVideoElement, timeAt: number) {
  return new Promise<HTMLImageElement | null>((r) => {
    queue.push({ v, t: timeAt, r });
    setTimeout(() => schedule());
  });
}

export function loadVideo(url: string) {
  return new Promise<HTMLVideoElement>((resolve) => {
    const v = document.createElement('video');
    v.onloadeddata = () => {
      resolve(v);
    };
    v.muted = true;
    v.controls = false;
    v.src = url;
    v.load();
  });
}
