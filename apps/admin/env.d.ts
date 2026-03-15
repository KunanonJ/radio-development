declare module "cloudflare:workers" {
  export const env: {
    APP_ENV?: string;
    ACCESS_AUDIENCE?: string;
    BILLING_PROVIDER?: string;
  };
}
