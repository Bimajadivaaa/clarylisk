'use client';

import React from "react";
import { Config, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { XellarKitProvider, defaultConfig, darkTheme } from "@xellar/kit";
import { liskSepolia, lisk } from "viem/chains";
import { XELLAR_APP_ID, WALLETCONNECT_PROJECT_ID } from "@/config/const";

const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
  xellarAppId: XELLAR_APP_ID,
  xellarEnv: "sandbox",
  ssr: false,
  // chains: [liskSepolia],
  chains: [lisk],
}) as Config;

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <XellarKitProvider
          theme={darkTheme}
        >
          {children}
        </XellarKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};