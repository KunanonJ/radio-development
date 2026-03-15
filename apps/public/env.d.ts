declare module "cloudflare:workers" {
  export const env: {
    APP_ENV?: string;
    STREAM_PLAYBACK_HOST?: string;
    PUBLIC_WIDGET_ID?: string;
  };
}
