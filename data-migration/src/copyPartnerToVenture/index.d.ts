// index.d.ts

export interface CopyVentureOptions {
  accessToken: string;
  env: string;
  locale: string;
  venture: string;
  partner: string;
}

declare const copyVenture: (options: CopyVentureOptions) => Promise<void>;

export default copyVenture;
