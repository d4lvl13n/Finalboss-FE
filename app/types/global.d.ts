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
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }
}