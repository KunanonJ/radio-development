/// <reference types="@cloudflare/workers-types" />

/** Pages Functions + Wrangler bindings */
export type SonicBloomEnv = {
  DB?: D1Database;
  MEDIA_BUCKET?: R2Bucket;
};

export const SCHEMA_VERSION = 2;
