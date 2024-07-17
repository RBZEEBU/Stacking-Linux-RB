import type { Metadata } from "next";
import "../globals.scss";
import App from "@/components/App";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/wagmiConfig";
import { Box, CssBaseline } from "@mui/material";
import { allMessages } from "../../appRouterI18n";
import { LinguiClientProvider } from "../../components/LinguiClientProvider";
import { Notifier } from "@/components/Notifier";
import AppAppBar from "@/components/AppAppBar";
import Footer from "@/components/Footer";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import { mainTitle } from "@/consts";
import { withLinguiLayout } from "../withLingui";
import Container from '@mui/material/Container';

export const metadata: Metadata = {
  title: mainTitle,
  description: mainTitle,
};

type Props = {
  params: {
    locale: string;
  };
  children: React.ReactNode;
};

export default withLinguiLayout(function RootLayout({
  params: { locale },
  children,
}: Props) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap"
          rel="stylesheet"
        />

      </head>
      <body>
        <Container maxWidth="lg" sx={{ "&.MuiContainer-maxWidthLg": { maxWidth: "1280px",},}}>
            <Box
              sx={{
                mt: 12,
                gap: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <LinguiClientProvider
                initialLocale={locale}
                initialMessages={allMessages[locale]!}
              >
                <App initialState={initialState}>
                  <CssBaseline />
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    minHeight="100vh"
                  >
                    <Box>
                      <AppAppBar />
                      <Notifier />
                      <ConnectWalletModal />
                      {children}
                    </Box>
                    <Footer />
                  </Box>
                </App>
              </LinguiClientProvider>
            </Box>
          </Container>
      </body>
    </html>
  );
});
