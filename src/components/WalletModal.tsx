"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import Image from "next/image";
import {
  useAccount,
  useBalance,
  useChainId,
  useChains,
  useDisconnect,
} from "wagmi";
import { Address, extractChain } from "viem";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { format } from "date-fns";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab, { TabProps } from "@mui/material/Tab";
import Tabs, { TabsProps } from "@mui/material/Tabs";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography, { TypographyProps } from "@mui/material/Typography";

import ContentCopyIcon from "@mui/icons-material/ContentCopyRounded";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { formatBalance, getChainIconUrl } from "@/lib/utils";
import { Link } from "@mui/material";

import { CONFIG } from "@/config";
import { useTransactions } from "@/hooks/useTransactions";
import { Recent_Transaction_Enum } from "@/types";
import CloseIcon from "./icons/CloseIcon";

type Timer = ReturnType<typeof setTimeout>;

type WalletModalProps = {
  open?: boolean;
  tabIndex?: number;
  onClose?: () => void;
};

const CopyTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "hsla(220, 25%, 25%, 1)",
    padding: 10,
    fontSize: "small",
  },
});

const WalletModalTabs = styled((props: TabsProps) => <Tabs {...props} />)(
  ({ theme }) => ({
    "& .MuiTabs-indicator": {
      backgroundColor: "transparent",
    },
  }),
);

const BalanceTypography = styled((props: TypographyProps) => (
  <Typography {...props} />
))(({ theme }) => ({
  fontFamily: "Sora",
  fontSize: "14px",
  fontWeight: "700",
}));

const WalletModalTab = styled((props: TabProps) => <Tab {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    fontWeight: "bold",
    border: "2px solid",
    opacity: 0.3,
    "&.Mui-selected": {
      border: "2px solid",
      borderColor: theme.palette.primary.contrastText,
      background:
        "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 6.67%, rgba(255, 255, 255, 0) 100%)",
      opacity: 1,
    },
    "&.MuiTab-textColorPrimary": {
      color: theme.palette.primary.contrastText,
    },
  }),
);

export default function WalletModal(props: WalletModalProps) {
  const [openTooltip, setOpenTooltip] = useState(false);
  const [tabIndex, setTabIndex] = useState(props.tabIndex ?? 0);
  const timeoutRef = useRef<Timer | undefined>();

  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { i18n } = useLingui();

  const Lock__Type__Mapping: { [key: string]: string } = {
    INCREASE_LOCK_AMOUNT: t(i18n)`Add Stake`,
    INCREASE_UNLOCK_TIME: t(i18n)`Extend`,
    WITHDRAW: t(i18n)`Withdraw`,
    CREATE_LOCK: t(i18n)`Stake`,
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const chainId = useChainId();
  const chains = useChains();

  const currentChain = useMemo(
    () => extractChain({ chains, id: chainId }),
    [chains, chainId],
  );

  const balance = useBalance({ address });

  const zbuContract = CONFIG.get(chainId)?.ZBU_CONTRACT! as Address;
  const zbuBalance = useBalance({ address, chainId, token: zbuContract });

  const veContract = CONFIG.get(chainId)?.VE_CONTRACT! as Address;
  const veZBUBalance = useBalance({ address, chainId, token: veContract });

  const veZBUUSDTContract = CONFIG.get(chainId)
    ?.BALANCER_POOL_VE_CONTRACT! as Address;
  const veZBUUSDTBalance = useBalance({
    address,
    chainId,
    token: veZBUUSDTContract,
  });

  const { recentTransactions, fetchTransactions } = useTransactions({
    account: address,
    chainId,
  });

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    setTabIndex(props.tabIndex ?? 0);
  }, [props.tabIndex]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setOpenTooltip(true);

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setOpenTooltip(false);
      }, 1000);
    }
  };

  return (
    <Dialog
      open={props.open || false}
      onClose={props.onClose}
      id="wallet-modal-dialog"
      fullWidth={isMobile}
      PaperProps={{
        sx: {
          width: { md: 554 },
        },
      }}
    >
      <DialogTitle
        fontFamily="Sora"
        fontSize="18px"
        fontWeight="700"
        sx={{ borderBottom: 1, border: "1px solid rgba(255, 255, 255, .3)" }}
      >
        <Trans>Your Wallet</Trans>
      </DialogTitle>
      <IconButton
        aria-label={t(i18n)`close`}
        onClick={props.onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ paddingTop: 3 }}>
        <WalletModalTabs
          value={tabIndex}
          onChange={(_, value) => setTabIndex(value)}
          centered
          sx={{
            display: "flex",
            alignItems: "center",
            paddingInline: 17,
            paddingY: 1.5,
          }}
        >
          <WalletModalTab
            label={t(i18n)`Wallet`}
            sx={{
              flex: 1,
              borderRadius: "8px 0px 0px 8px",
            }}
          />
          <WalletModalTab
            label={t(i18n)`Transactions`}
            sx={{
              flex: 1,
              borderRadius: "0px 8px 8px 0px",
            }}
          />
        </WalletModalTabs>
      </Box>
      {tabIndex === 0 ? (
        <>
          <DialogContent>
            <Paper
              sx={{
                display: "flex",
                justifyContent: "space-between",
                background:
                  "linear-gradient(127.43deg, rgba(255, 255, 255, 0.1) 2.54%, rgba(153, 153, 153, 0.1) 97.47%)",
                alignItems: "flex-start",
                flexDirection: "column",
                position: "relative",
                height: { md: 75 },
                padding: "15px",
              }}
            >
              <Typography
                display="block"
                fontFamily="Sora"
                fontSize="12px"
                fontWeight="400"
              >
                <Trans>Your address</Trans>
              </Typography>
              <Typography
                sx={{
                  overflowY: "hidden",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  fontFamily: "Sora",
                  fontSize: "16px",
                  fontWeight: "700",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  display: "block",
                }}
              >
                {address}
              </Typography>
              <CopyTooltip
                open={openTooltip}
                title={t(i18n)`Copied`}
                arrow
                placement="left"
              >
                <IconButton
                  onClick={handleCopy}
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <ContentCopyIcon sx={{ color: "white" }} />
                </IconButton>
              </CopyTooltip>
            </Paper>
            <Stack mt={3} spacing={2}>
              <Box display="flex" justifyContent="space-between">
                <Paper
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgb(98, 126, 234)",
                    borderRadius: 16,
                    padding: "5px",
                    paddingRight: "10px",
                  }}
                >
                  <Image
                    src={getChainIconUrl(currentChain)}
                    width={24}
                    height={24}
                    alt={currentChain.name}
                  />
                  <Typography color="white" fontWeight="bold">
                    {currentChain.name}
                  </Typography>
                </Paper>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`${currentChain.blockExplorers?.default.url}/address/${address}`}
                  display="flex"
                  color="text.primary"
                >
                  <Trans>Explore</Trans>
                  <ArrowOutwardIcon sx={{ ml: 1 }} />
                </Link>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <BalanceTypography>
                  <Trans>{currentChain.nativeCurrency.symbol} Balance</Trans>
                </BalanceTypography>
                {!!balance.data && (
                  <BalanceTypography>
                    {formatBalance(balance.data.value, balance.data.decimals)}
                  </BalanceTypography>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${currentChain.blockExplorers?.default.url}/token/${zbuContract}`}
                    display="flex"
                    color="text.primary"
                  >
                    <BalanceTypography>
                      <Trans>ZBU Balance</Trans>
                    </BalanceTypography>
                    <ArrowOutwardIcon sx={{ ml: 1 }} />
                  </Link>
                </Typography>
                {!!zbuBalance.data && (
                  <BalanceTypography>
                    {formatBalance(
                      zbuBalance.data.value,
                      zbuBalance.data.decimals,
                    )}
                  </BalanceTypography>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${currentChain.blockExplorers?.default.url}/token/${veContract}`}
                    display="flex"
                    color="text.primary"
                  >
                    <BalanceTypography>
                      <Trans>VeZBU Balance</Trans>
                    </BalanceTypography>
                    <ArrowOutwardIcon sx={{ ml: 1 }} />
                  </Link>
                </Typography>
                {!!veZBUBalance.data && (
                  <BalanceTypography>
                    {formatBalance(
                      veZBUBalance.data.value,
                      veZBUBalance.data.decimals,
                    )}
                  </BalanceTypography>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${currentChain.blockExplorers?.default.url}/token/${veZBUUSDTContract}`}
                    display="flex"
                    color="text.primary"
                  >
                    <BalanceTypography>
                      <Trans>VeZBU-USDT Balance</Trans>
                    </BalanceTypography>
                    <ArrowOutwardIcon sx={{ ml: 1 }} />
                  </Link>
                </Typography>
                {!!veZBUUSDTBalance.data && (
                  <BalanceTypography>
                    {formatBalance(
                      veZBUUSDTBalance.data.value,
                      veZBUUSDTBalance.data.decimals,
                    )}
                  </BalanceTypography>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ paddingX: 3, paddingBottom: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => {
                disconnect();
                props.onClose?.();
              }}
              sx={{
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 6.67%, rgba(255, 255, 255, 0) 100%)",
                color: "white",
                borderColor: "white",
                "&:hover": {
                  background:
                    "linear-gradient(180deg, rgba(255, 255, 255, 0.35) 6.67%, rgba(255, 255, 255, 0) 100%)",
                  borderColor: "white",
                },
              }}
            >
              <Trans>Disconnect Wallet</Trans>
            </Button>
          </DialogActions>
        </>
      ) : (
        <DialogContent
          sx={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {recentTransactions.length > 0 ? (
            <>
              <BalanceTypography
                fontSize="16px"
                variant="overline"
                color="white"
              >
                <Trans>Recent transactions</Trans>
              </BalanceTypography>
              <Box
                textAlign="left"
                paddingBottom={5}
                display="flex"
                flexDirection="column"
              >
                <Stack spacing={2}>
                  {recentTransactions.map((tx, index) => (
                    <Box
                      key={index}
                      display="flex"
                      justifyContent="space-between"
                      paddingY={1}
                      alignItems="center"
                      sx={{ borderBottom: "1px solid rgba(255, 255, 255, .3)" }}
                    >
                      <Typography display="flex" flex={1}>
                        {tx.type === Recent_Transaction_Enum.LOCK
                          ? `${tx.lockType ? Lock__Type__Mapping[tx.lockType] || t(i18n)`Unknown` : t(i18n)`Unknown`}`
                          : tx.type === Recent_Transaction_Enum.REWARD_CLAIM
                            ? t(i18n)`Claim Rewards`
                            : t(i18n)`Unknown`}
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        flex={1}
                        justifyContent="flex-end"
                      >
                        <BalanceTypography
                          variant="body2"
                          sx={{ marginRight: 2 }}
                        >
                          {format(
                            new Date(tx.timestamp * 1000),
                            "MMMM dd yyyy HH:mm",
                          )}
                        </BalanceTypography>
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`${currentChain.blockExplorers?.default.url}/tx/${tx.tx}`}
                          display="flex"
                        >
                          <ArrowOutwardIcon />
                        </Link>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                textAlign: "center",
                width: { md: 329 },
              }}
            >
              <Box sx={{ padding: 2 }}>
                <img
                  src="/tx.svg"
                  style={{ maxWidth: "80px", maxHeight: "80px" }}
                />
              </Box>
              <BalanceTypography sx={{ fontSize: "20px" }}>
                <Trans>No recent transactions</Trans>
              </BalanceTypography>
              <BalanceTypography sx={{ fontSize: "16px", fontWeight: "400" }}>
                No new recent transactions at the moment
              </BalanceTypography>
            </Box>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
