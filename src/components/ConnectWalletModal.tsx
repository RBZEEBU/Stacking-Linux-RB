"use client";

import * as React from "react";
import { CreateConnectorFn, useConnect } from "wagmi";
import { coinbaseWallet, injected, safe } from "wagmi/connectors";
import type { EIP1193Provider } from "viem";
import Button from "@mui/material/Button";
import {
  Avatar,
  Box,
  Grid,
  Card,
  Stack,
  CardContent,
  alpha,
  useTheme,
} from "@mui/material";
import { Trans } from "@lingui/macro";

import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { ConnectWalletContext } from "@/contexts/ConnectWallet";
import CloseIcon from "./icons/CloseIcon";
import SendArrowIcon from "./icons/SendArrowIcon";
import { brand } from "@/app/getLPTheme";
import { walletConnectFn } from "@/wagmiConfig";

type BinanceWindow = {
  BinanceChain?: {
    bnbSign?: (
      address: string,
      message: string,
    ) => Promise<{
      publicKey: string;
      signature: string;
    }>;
    switchNetwork?: (networkId: string) => Promise<string>;
  } & EIP1193Provider;
};

const WalletButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 14,
  fontWeight: "bold",
  padding: "6px 18px",
  border: "1px solid",
  lineHeight: 1.5,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 6.67%, rgba(255, 255, 255, 0.00) 100%)",
  borderColor: "#F5F5F5",
  color: theme.palette.text.primary,
  height: 50,
  marginTop: 20,
  "&:hover": {
    backgroundColor: "hsl(17, 100%, 68%)",
    borderColor: "none",
    boxShadow: "none",
    color: "white",
    "& svg": {
      stroke: "white",
    },
  },
  "&:active": {
    boxShadow: "none",
    background: "linear-gradient(180deg, #FFE3B5 32.17%, #D3390B 100%)",
    borderColor: "none",
  },
  "&:focus": {
    boxShadow: "none",
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CardButton = styled(Card)(({ theme }) => ({
  width: "100%",
  borderRadius: "10px",
  border: "1px solid rgba(255, 255, 255, 0.20)",
  background:
    "linear-gradient(127deg, rgba(255, 255, 255, 0.10) 2.54%, rgba(153, 153, 153, 0.10) 97.47%)",
  backdropFilter: "blur(60px)",
  padding: "10px",
  cursor: "pointer",
  "&:hover": {
    background:
      theme.palette.mode === "dark" ? "#9F7E73" : alpha(brand[300], 0.2),
  },
}));

export default function ConnectWalletModal() {
  const theme = useTheme();
  const { connectAsync } = useConnect();
  const { isModalOpen, close } = React.useContext(ConnectWalletContext);

  const connectWallet = async (connector: CreateConnectorFn) => {
    await connectAsync({ connector });
    close();
  };

  return (
    <BootstrapDialog
      onClose={close}
      aria-labelledby="customized-dialog-title"
      open={isModalOpen}
      maxWidth="md"
      sx={{ border: "none" }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          borderBottom: 1,
          borderColor: "rgba(255,255,255,0.3)",
        }}
        id="customized-dialog-title"
      >
        <Trans>Connect Wallet</Trans>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={close}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item md={5}>
            <Card sx={{ p: 0.5, borderRadius: 1.7 }}>
              <CardContent>
                <Stack direction="row" alignItems="center">
                  <Avatar
                    alt=""
                    src="/walleticon.svg"
                    sx={{ width: 65, height: 65, borderRadius: 0 }}
                  />
                </Stack>
                <Stack direction="row" alignItems="center">
                  <Box>
                    <Typography
                      fontSize={16}
                      fontWeight={700}
                      paddingTop={2}
                      gutterBottom
                    >
                      <Trans>Connect Your Wallet</Trans>
                    </Typography>
                    <Typography fontSize={14} variant="body2">
                      <Trans>
                        Start by connecting with one of the wallet from the
                        given options. Be sure to store your private keys or
                        seed phrase securely. Never share them with anyone.
                      </Trans>
                    </Typography>
                    <Typography variant="body2" component="span">
                      <WalletButton
                        disableRipple
                        onClick={() =>
                          window.open(
                            "https://learn.metamask.io/lessons/what-is-a-crypto-wallet",
                            "_blank",
                            "noreferrer noopener",
                          )
                        }
                      >
                        <Stack
                          justifyContent="space-between"
                          alignItems="end"
                          direction="row"
                          width="100%"
                          lineHeight="30px"
                        >
                          <Typography mr={1} fontWeight="bold">
                            <Trans>What Is A Wallet?</Trans>
                          </Typography>
                          <SendArrowIcon />
                        </Stack>
                      </WalletButton>
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={7}>
            <Card sx={{ p: 0, borderRadius: 1.7 }}>
              <CardContent>
                <Stack alignItems="left">
                  <Box>
                    <Typography
                      color="text.primary"
                      fontSize={16}
                      fontWeight={700}
                      gutterBottom
                    >
                      <Trans>Available Wallet</Trans>
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row">
                  <Grid item md={6} mr={1}>
                    <CardButton
                      onClick={() =>
                        connectWallet(injected({ target: "metaMask" }))
                      }
                    >
                      <Stack direction="row" gap={1}>
                        <Avatar
                          alt=""
                          src="/wallet-icon/metamask.svg"
                          sx={{ width: 30, height: 30 }}
                        />
                        <Box width="100%">
                          <Typography
                            variant="overline"
                            sx={{ lineHeight: "30px" }}
                          >
                            Metamask
                          </Typography>
                        </Box>
                      </Stack>
                    </CardButton>
                  </Grid>
                  <Grid item md={6}>
                    <CardButton
                      onClick={() =>
                        connectWallet(injected({ target: "trustWallet" }))
                      }
                    >
                      <Stack direction="row" gap={1} alignItems="left">
                        <Avatar
                          alt=""
                          src="/wallet-icon/trust.svg"
                          sx={{ width: 30, height: 30 }}
                        />
                        <Box width="100%">
                          <Typography
                            variant="overline"
                            sx={{ lineHeight: "30px" }}
                          >
                            Trust Wallet
                          </Typography>
                        </Box>
                      </Stack>
                    </CardButton>
                  </Grid>
                </Stack>
                <Stack direction="row" sx={{ marginTop: "10px" }}>
                  <Grid item md={6} mr={1}>
                    <CardButton onClick={() => connectWallet(safe())}>
                      <Stack direction="row" gap={1}>
                        <Avatar
                          alt=""
                          src="/wallet-icon/safe.svg"
                          sx={{ width: 30, height: 30 }}
                        />
                        <Box width="100%">
                          <Typography
                            variant="overline"
                            sx={{ lineHeight: "30px" }}
                          >
                            Safe
                          </Typography>
                        </Box>
                      </Stack>
                    </CardButton>
                  </Grid>
                  <Grid item md={6}>
                    <CardButton onClick={() => connectWallet(walletConnectFn)}>
                      <Stack direction="row" gap={1} alignItems="left">
                        <Avatar
                          alt=""
                          src="/wallet-icon/wallet-connect.svg"
                          sx={{ width: 30, height: 30 }}
                        />
                        <Box width="100%">
                          <Typography
                            variant="overline"
                            sx={{ lineHeight: "30px" }}
                          >
                            Wallet Connect
                          </Typography>
                        </Box>
                      </Stack>
                    </CardButton>
                  </Grid>
                </Stack>
                <Stack direction="row" sx={{ marginTop: "10px" }}>
                  <Grid item md={6} mr={1}>
                    <CardButton
                      onClick={() =>
                        connectWallet(
                          injected({
                            target: {
                              id: "binance",
                              name: "Binance",
                              provider: (window) =>
                                (window as BinanceWindow)?.BinanceChain,
                            },
                          }),
                        )
                      }
                    >
                      <Stack direction="row" gap={1}>
                        <Avatar
                          alt=""
                          src="/wallet-icon/binance.svg"
                          sx={{ width: 30, height: 30 }}
                        />
                        <Box width="100%">
                          <Typography
                            variant="overline"
                            sx={{ lineHeight: "30px" }}
                          >
                            Binance
                          </Typography>
                        </Box>
                      </Stack>
                    </CardButton>
                  </Grid>
                  <Grid item md={6}>
                    <CardButton
                      onClick={() =>
                        connectWallet(injected({ target: "phantom" }))
                      }
                    >
                      <Stack direction="row" gap={1} alignItems="left">
                        <Avatar
                          alt=""
                          src="/wallet-icon/phantom.svg"
                          sx={{ width: 30, height: 30 }}
                        />
                        <Box width="100%">
                          <Typography
                            variant="overline"
                            sx={{ lineHeight: "30px" }}
                          >
                            Phantom
                          </Typography>
                        </Box>
                      </Stack>
                    </CardButton>
                  </Grid>
                </Stack>
                <Stack direction="row" sx={{ marginTop: "10px" }}>
                  <Grid item md={6} mr={1}>
                    <CardButton
                      onClick={() =>
                        connectWallet(
                          coinbaseWallet({ appName: "Zeebu Staking" }),
                        )
                      }
                    >
                      <Stack direction="row" gap={1}>
                        <Avatar
                          alt=""
                          src="/wallet-icon/coinbase.svg"
                          sx={{ width: 30, height: 30 }}
                        />
                        <Box width="100%">
                          <Typography
                            variant="overline"
                            sx={{ lineHeight: "30px" }}
                          >
                            Coinbase
                          </Typography>
                        </Box>
                      </Stack>
                    </CardButton>
                  </Grid>
                  <Grid item md={6}>
                    <CardButton>
                      <Stack direction="row" gap={1} alignItems="left">
                        <Avatar
                          alt="coming-soon"
                          src={`/wallet-icon/coming-soon-${theme.palette.mode}.svg`}
                          sx={{ width: 30, height: 30 }}
                        />
                        <Box width="100%">
                          <Typography
                            variant="overline"
                            sx={(theme) => ({
                              color: alpha(theme.palette.text.primary, 0.5),
                              lineHeight: "30px",
                            })}
                          >
                            <Trans>Coming Soon</Trans>
                          </Typography>
                        </Box>
                      </Stack>
                    </CardButton>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </BootstrapDialog>
  );
}
