export {};

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string | string[],
      params?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        non_interaction?: boolean;
        page_path?: string;
        send_page_view?: boolean;
        transport_type?: string;
        [key: string]: string | number | boolean | undefined;
      }
    ) => void;
    dataLayer: Array<Record<string, unknown>>;
    adsbygoogle?: Array<Record<string, unknown>>;
    /** Set when the AdSense script has executed (manual + auto init). */
    __adScriptLoaded?: boolean;
    ezstandalone?: {
      cmd: Array<() => void>;
      showAds?: (...ids: number[]) => void;
      destroyPlaceholders?: (...ids: number[]) => void;
      destroyAll?: () => void;
      isEzoicUser?: () => boolean;
    };
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  }
}
