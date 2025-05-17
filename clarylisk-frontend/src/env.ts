import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {},
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get type errors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_XELLAR_APP_ID: z.string().min(1),
    NEXT_PUBLIC_CLARYLISK_BACKEND: z.string().min(1),
    NEXT_PUBLIC_CLARYLISK_CONTRACT: z.string().min(1),
    NEXT_PUBLIC_CREATOR_HUB_FACTORY: z.string().min(1),
    NEXT_PUBLIC_IDRX_CONTRACT: z.string().min(1),
    NEXT_PUBLIC_CREATOR_LINK_GENERATOR: z.string().min(1),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_XELLAR_APP_ID: process.env.NEXT_PUBLIC_XELLAR_APP_ID,
    NEXT_PUBLIC_CLARYLISK_BACKEND: process.env.NEXT_PUBLIC_CLARYLISK_BACKEND,
    NEXT_PUBLIC_CLARYLISK_CONTRACT: process.env.NEXT_PUBLIC_CLARYLISK_CONTRACT,
    NEXT_PUBLIC_CREATOR_HUB_FACTORY:
      process.env.NEXT_PUBLIC_CREATOR_HUB_FACTORY,
    NEXT_PUBLIC_IDRX_CONTRACT: process.env.NEXT_PUBLIC_IDRX_CONTRACT,
    NEXT_PUBLIC_CREATOR_LINK_GENERATOR:
      process.env.NEXT_PUBLIC_CREATOR_LINK_GENERATOR,
  },
});
