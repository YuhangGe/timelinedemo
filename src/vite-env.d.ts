/// <reference types="vite/client" />

/* IMAGES */
declare module '*.svg' {
  const ref: string;
  export default ref;
}

declare module '*.png' {
  const ref: string;
  export default ref;
}

export declare global {
  interface Window {
    // SomeVar: string
  }
}
