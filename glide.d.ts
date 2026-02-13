declare module '@glidejs/glide' {
  export interface GlideOptions {
    type?: 'slider' | 'carousel';
    startAt?: number;
    perView?: number;
    focusAt?: number | 'center';
    gap?: number;
    autoplay?: number | boolean;
    hoverpause?: boolean;
    keyboard?: boolean;
    bound?: boolean;
    swipeThreshold?: number | boolean;
    dragThreshold?: number | boolean;
    perTouch?: number | boolean;
    touchRatio?: number;
    touchAngle?: number;
    animationDuration?: number;
    rewind?: boolean;
    rewindDuration?: number;
    animationTimingFunc?: string;
    direction?: 'ltr' | 'rtl';
    peek?: number | { before: number; after: number };
    breakpoints?: {
      [key: number]: Partial<GlideOptions>;
    };
    classes?: {
      [key: string]: string;
    };
    throttle?: number;
  }

  export default class Glide {
    constructor(selector: string | HTMLElement, options?: GlideOptions);
    mount(extensions?: { [key: string]: any }): Glide;
    destroy(): void;
    update(options?: GlideOptions): void;
    go(pattern: string): void;
    pause(): void;
    play(interval?: number): void;
    disable(): void;
    enable(): void;
    on(event: string | string[], handler: (context?: any) => void): void;
    isType(type: string): boolean;
    settings: GlideOptions;
    index: number;
    type: string;
    disabled: boolean;
  }
}

declare module '@glidejs/glide/dist/css/glide.core.min.css' {
  const content: { [className: string]: string };
  export default content;
}