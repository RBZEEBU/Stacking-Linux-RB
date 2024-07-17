"use client";

import { WagmiProvider, type State } from "wagmi";
import { GlobalStyles } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { PoolsProvider } from "@/contexts/Pools";
import { AlertsProvider } from "@/contexts/Alerts";
import { ColorModeProvider } from "@/contexts/ColorMode";
import { TransactionsProvider } from "@/contexts/Transactions";
import { ConnectWalletProvider } from "@/contexts/ConnectWallet";
import { NotificationsProvider } from "@/contexts/Notifications";
import { config } from "@/wagmiConfig";

const queryClient = new QueryClient();

export default function App({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: State | undefined;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ColorModeProvider>
        <GlobalStyles
          styles={(theme) => {
            return {
              body: {
                background: `#071FD4`,
                "&:before": {
                  content: '""',
                  position: 'fixed',
                  background: `url(/bg-${theme.palette.mode}.png) no-repeat top`,
                  backgroundSize: "cover",
                  height: "100%",
                  width: "100%;",
                  zIndex:"-1",
                  top:"0",
                },
              },
            };
          }}
        />
        <WagmiProvider config={config} initialState={initialState}>
          <QueryClientProvider client={queryClient}>
            <ConnectWalletProvider>
              <AlertsProvider>
                <NotificationsProvider>
                  <PoolsProvider>
                    <TransactionsProvider>{children}</TransactionsProvider>
                  </PoolsProvider>
                </NotificationsProvider>
              </AlertsProvider>
            </ConnectWalletProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ColorModeProvider>
    </LocalizationProvider>
  );
}
