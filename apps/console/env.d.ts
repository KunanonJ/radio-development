declare module "cloudflare:workers" {
  export const env: {
    APP_ENV?: string;
    CONTROL_API_URL?: string;
    STREAM_PLAYBACK_HOST?: string;
  };
}
