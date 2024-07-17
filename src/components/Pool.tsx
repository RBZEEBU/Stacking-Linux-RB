"use client";

import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/navigation";
import { useLingui } from "@lingui/react";
import {
  Avatar,
  Box,
  Grid,
  Card,
  Collapse,
  Divider,
  Link,
  Tooltip,
  Typography,
  Stack,
  Button,
  CardContent,
  CardActions,
} from "@mui/material";
import * as dn from "dnum";
import { styled } from '@mui/material/styles';

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNewRounded";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useContext, useMemo, useState } from "react";
import { Alert_Kind__Enum_Type, Pool__Type } from "@/types";
import { formatBalance, getNextEpoch, secondsInDays } from "@/lib/utils";
import { getTime, isPast, secondsToMilliseconds, toDate } from "date-fns";
import { formatHash } from "@/lib/formatting";
import { useAccount, useChainId, useChains } from "wagmi";
import { ActionButton } from "./ActionButton";
import { AlertsContext } from "@/contexts/Alerts";
import { usePools } from "@/hooks/usePools";
import { CONFIG } from "@/config";
import { useWithdraw } from "@/hooks/useWithdraw";
import { useToken } from "@/hooks/useToken";
import { useRewards } from "@/hooks/useRewards";
import { useApr } from "@/hooks/useApr";
import { extractChain } from "viem";
import Countdown from "./Countdown";
import ExpandButton from "./ExpandButton";
import StakeInfo from "./StakeInfo";
import { ConnectWalletContext } from "@/contexts/ConnectWallet";
import PoolAvatar from "./PoolAvatar";
import Image from "next/image";

type PoolProps = {
  pool: Pool__Type;
};

const displayCompact = (value: bigint, decimals: number) =>
  dn.greaterThan([value, decimals], [BigInt(100_000), 0]);

const CardNew = styled(Card)({
    width:"100%",
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.20)',
    background: 'linear-gradient(127deg, rgba(255, 255, 255, 0.10) 2.54%, rgba(153, 153, 153, 0.10) 97.47%)',
    backdropFilter: 'blur(60px)',
    padding:"10px",
    cursor:"pointer",
    "&:hover": { background:'#9F7E73'},
});

const CustomButton = styled(Button)(({ theme }) => ({
  width: "100%",
  height: "auto",
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.20)',
  background: 'linear-gradient(127deg, rgba(255, 255, 255, 0.10) 2.54%, rgba(153, 153, 153, 0.10) 97.47%)',
  backdropFilter: 'blur(60px)',
  padding: "6px 10px",
  cursor: "pointer",
  "&:hover": { background: '#9F7E73' },
  "svg": { position: "absolute", right: "10px", top: "10px", fontSize: "30px" },
  color: theme.palette.mode === "light"
    ? "#000"
    : "#FFF",
}));


export default function Pool(props: PoolProps) {
  const { pool } = props;

  const { id, name, stake, tokenSymbol, decimals, yourStake, address, admin } =
    pool;

  const [expanded, setExpanded] = useState(false);

  const { showAlert } = useContext(AlertsContext);
  const { open } = useContext(ConnectWalletContext);

  const { address: account, isConnected } = useAccount();
  const chainId = useChainId();
  const router = useRouter();
  const { i18n } = useLingui();

  const { fetchPool } = usePools({ account, chainId });

  const balancerPoolContract = CONFIG.get(chainId)?.BALANCER_POOL_VE_CONTRACT!;
  const balancerPoolLiquidityUrl =
    CONFIG.get(chainId)?.BALANCER_POOL_LIQUIDITY_URL!;

  const isLockFinished = isPast(new Date(secondsToMilliseconds(pool.end)));
  const isStaking = pool.yourStake !== "0";

  const allowWithdraw = isConnected && isLockFinished && isStaking;

  const chains = useChains();

  const currentChain = useMemo(
    () => extractChain({ chains, id: chainId }),
    [chains, chainId],
  );

  const { fetchBalance, balance } = useToken({
    token: pool.tokenAddress,
    spender: pool.address,
    owner: account,
  });

  const isBalancerPool =
    address.toLowerCase() === balancerPoolContract?.toLowerCase();
  const hasLPBalance = balance > BigInt(0);

  const { withdraw, loading: isLoadingWithdraw } = useWithdraw({
    address: pool.address,
    onSuccess: () => {
      fetchPool(pool.id);
      fetchBalance();
      showAlert({
        kind: Alert_Kind__Enum_Type.SUCCESS,
        message: t(i18n)`You have successfully withdrawn ${formatBalance(
          BigInt(pool.yourStake),
          18,
        )} ${tokenSymbol}`,
      });
    },
    onSubmitted: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.PROGRESS,
        message: t(
          i18n,
        )`Withdrawing ${formatBalance(BigInt(pool.yourStake), 18)} ${tokenSymbol}`,
      });
    },
    onError: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.ERROR,
        message: t(i18n)`There was an error withdrawing the tokens`,
      });
    },
  });

  const currentTime = useMemo(() => new Date(), []);

  const { total: totalWeekRewards } = useRewards({
    pool,
    timestamp: getTime(currentTime),
    chainId,
  });

  const { yearApr } = useApr({
    address: pool.address,
    owner: account,
    totalWeekRewards,
    locked: BigInt(pool.yourStake),
  });

  return (
    <Card
      sx={(theme) => ({
        height: "fit-content",
        width: "100%",
        backdropFilter: "blur(25px)",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(122.12deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.16) 100%)"
            : "linear-gradient(127.43deg, rgba(255, 255, 255, 0.15) 2.54%, rgba(153, 153, 153, 0.15) 97.47%)",
        borderRadius: "20px",
        border: theme.palette.mode === "light" ? "2px solid" : "none",
        borderImageSource:
          theme.palette.mode === "light"
            ? "linear-gradient(302.12deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)"
            : "none",
        boxShadow:
          theme.palette.mode === "light"
            ? "4px 4px 4px 0px #FFFFFF40 inset"
            : "0px 3px 4px 0px #297FEA26 inset",
        "&:hover": {
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(122.12deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.16) 100%)"
              : "linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)",
          borderColor:
            theme.palette.mode === "light" ? "primary.light" : "primary.dark",
          boxShadow:
            theme.palette.mode === "light"
              ? "0px 2px 8px hsla(0, 0%, 0%, 0.1)"
              : "0px 1px 8px hsla(210, 100%, 25%, 0.5)",
        },
        "&:before": {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            theme.palette.mode === "light"
              ? ""
              : "linear-gradient(4deg, #ff895b, #0000, #ff895b)",
          backdropFilter: "blur(60px)",
          borderBottom: 'none',
          borderRadius: "20px",
          zIndex: -1,
          inset: 0,
          mask: 'linear-gradient(#142aa8 0 0) content-box, linear-gradient(#142aa8 0 0)',
          maskComposite: 'exclude',
          padding: '1px',
        },
      })}
    >
      <Grid container alignItems="center" p={2.5} rowSpacing={2}>
        <Grid item xs={10} md={4} order={{ xs: 1, md: 1 }}>
          <Stack direction="row" gap={1} alignItems="center">
            {isBalancerPool ? (
              <PoolAvatar
                srcToken1="/zeebu-logo.svg"
                srcToken2="/usdt-logo.svg"
              />
            ) : (
              <Avatar alt={tokenSymbol} src="/zeebu-logo.svg" />
            )}
            <Box>
              <Typography color="text.primary" fontWeight={700} gutterBottom>
                {name}
              </Typography>
              <Typography color="text.secondary">{tokenSymbol}</Typography>
            </Box>
          </Stack>
        </Grid>
        {isBalancerPool ? (
          <Grid item xs={6} md={1} order={{ xs: 2, md: 2 }}>
            <Typography color="text.secondary">
              <Trans>APR</Trans>
            </Typography>
            <Stack direction="row" gap={1} alignContent="center">
              <Typography fontWeight={700}>
                {formatBalance(yearApr, 18, 2)}%
              </Typography>
              <Tooltip
                title={<Trans>Based in weekly ZBU rewards</Trans>}
                arrow
                placement="top"
              >
                <InfoOutlinedIcon sx={{ fontSize: "1.2em" }} />
              </Tooltip>
            </Stack>
          </Grid>
        ) : null}

        <Grid item xs={6} md={2} order={{ xs: 3, md: 3 }}>
          <Typography color="text.secondary">
            <Trans>Total Staked</Trans>
          </Typography>
          <Typography fontWeight={700}>
            {formatBalance(
              BigInt(stake),
              Number(decimals),
              2,
              displayCompact(BigInt(stake), Number(decimals)),
            )}{" "}
            {isBalancerPool ? "LP" : tokenSymbol}
          </Typography>
        </Grid>
        <Grid item xs={6} md={2} order={{ xs: 4, md: 4 }}>
          <Typography color="text.secondary">
            <Trans>Your Stake</Trans>
          </Typography>
          <Typography fontWeight={700}>
            {formatBalance(
              BigInt(yourStake),
              Number(decimals),
              2,
              displayCompact(BigInt(yourStake), Number(decimals)),
            )}{" "}
            {isBalancerPool ? "LP" : tokenSymbol}
          </Typography>
        </Grid>
        {isBalancerPool ? (
          <Grid item xs={6} md={1} order={{ xs: 5, md: 5 }}>
            <Typography color="text.secondary">
              <Trans>Available</Trans>
            </Typography>
            <Typography fontWeight={700}>
              {formatBalance(
                balance,
                Number(decimals),
                2,
                displayCompact(balance, Number(decimals)),
              )}{" "}
              {isBalancerPool ? "LP" : tokenSymbol}
            </Typography>
          </Grid>
        ) : null}
        {isBalancerPool ? null : (
          <Grid item xs={6} md={2} order={{ xs: 6, md: 6 }}>
            <Typography color="text.secondary">
              <Trans>NEXT EPOCH</Trans>
            </Typography>
            <Typography fontWeight={700}>
              <Countdown date={getNextEpoch()} />
            </Typography>
          </Grid>
        )}
        <Grid
          item
          xs
          display="flex"
          justifyContent="end"
          alignItems="center"
          height="100%"
          order={{ xs: 1, md: 7 }}
        >
          <ExpandButton
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            sx={(theme) => ({
              width: { xs: '40px', md: '60%' },
              "&:hover": {
                borderColor: theme.palette.mode === "light" ? "hsla(0, 0%, 0%, 0.2)" : "hsl(0, 0%, 100%)",
              },
            })}
          >
            {expanded ? t(i18n)`Hide` : t(i18n)`Details`}
          </ExpandButton>
        </Grid>
      </Grid>
      <Collapse in={expanded}>
        <Divider />
        <Grid container p={2} spacing={3}>
          {isStaking ? (
            <>
              <Grid
                item
                md={4}
                xs={12}
                gap={1}
                display="flex"
                direction="column"
              >
                <StakeInfo pool={pool} showImage={false} />
              </Grid>
              <Grid item md={8} xs={12}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                  <Stack gap={1}>
                      {isBalancerPool ? (
                          <CustomButton
                            fullWidth
                            onClick={() =>
                              window.open(balancerPoolLiquidityUrl, "_blank")
                            }
                          >
                            <Box sx={(theme) => ({
                              width: "100%",
                              textAlign:"left",
                              fontWeight:"bold",
                            })}>
                                <Avatar sx={(theme) => ({float:"left", marginRight:"15px" })} alt={tokenSymbol} src="/addliquidity.svg" />
                                <Box sx={{ paddingTop: '6px', display: 'block' }}>
                                  <Trans>Add Liquidity</Trans>
                                </Box>
                                <KeyboardArrowRightIcon />
                              </Box>
                          </CustomButton>
                      ) : null}
                      
                      <CustomButton
                        fullWidth
                        onClick={() => router.push(`/stake/${id}/extend`)}
                        disabled={isLockFinished}
                      >
                        <Box sx={(theme) => ({
                          width: "100%",
                          textAlign:"left",
                          fontWeight:"bold",
                        })}>
                            <Avatar sx={(theme) => ({float:"left", marginRight:"15px" })} alt={tokenSymbol} src="/addstak.svg" />
                            <Box sx={{ paddingTop: '6px', display: 'block' }}>
                              <Trans>Add Stake</Trans>
                            </Box>
                            <KeyboardArrowRightIcon />
                        </Box>
                      </CustomButton>
                      <CustomButton
                        fullWidth
                        onClick={() => router.push(`/stake/${id}/extend`)}
                        disabled={isLockFinished}
                      >
                        <Box sx={(theme) => ({
                            width: "100%",
                            textAlign:"left",
                            fontWeight:"bold",
                          })}>
                          <Avatar sx={(theme) => ({float:"left", marginRight:"15px" })} alt={tokenSymbol} src="/extendicon.svg" />
                          <Box sx={{ paddingTop: '6px', display: 'block' }}>
                            <Trans>Extend</Trans>
                          </Box>
                          <KeyboardArrowRightIcon />
                          </Box>
                      </CustomButton>
                      {isLockFinished ? (
                        <CustomButton
                          onClick={withdraw}
                          //loading={isLoadingWithdraw}
                          disabled={!allowWithdraw}
                        >
                          <Box sx={(theme) => ({
                            width: "100%",
                            textAlign:"left",
                            fontWeight:"bold",
                          })}>
                          <Avatar sx={(theme) => ({float:"left", marginRight:"15px" })} alt={tokenSymbol} src="/withdrawicon.svg" />
                          <Box sx={{ paddingTop: '6px', display: 'block' }}>
                            <Trans>Withdraw</Trans>
                          </Box>
                          <KeyboardArrowRightIcon />
                          </Box>
                        </CustomButton>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => router.push(`/stake/${id}/withdraw`)}
                        >
                          <Trans>Early Withdraw</Trans>
                        </Button>
                      )}
                      <CustomButton
                        fullWidth
                        onClick={() => router.push(`/stake/${id}/claim`)}
                      >
                        <Box sx={(theme) => ({
                            width: "100%",
                            textAlign:"left",
                            fontWeight:"bold",
                          })}>
                          <Avatar sx={(theme) => ({float:"left", marginRight:"15px" })} alt={tokenSymbol} src="/claimicon.svg" />
                          <Box sx={{ paddingTop: '6px', display: 'block' }}>
                            <Trans>Claim</Trans>
                          </Box>
                          <KeyboardArrowRightIcon />
                          </Box>
                      </CustomButton>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </>
          ) : (
            <>
              <Grid
                item
                md={4}
                xs={12}
                gap={1}
                display="flex"
                direction="column"
              >

                <Stack direction="row" gap={2} alignItems="center">
                  <Avatar alt={tokenSymbol} src="/contractaddress.svg" />
                  <Box width="100%">
                    <Typography variant="overline" color="text.secondary">
                      <Trans>Contract Address</Trans>
                    </Typography>
                    <Typography component="span">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${currentChain.blockExplorers?.default.url}/address/${address}`}
                        display="flex"
                      >
                        <Stack
                          justifyContent="space-between"
                          alignItems="center"
                          direction="row"
                          width="100%"
                        >
                          {formatHash(address, 5, 4)}

                          <OpenInNewIcon />
                        </Stack>
                      </Link>
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
                <Stack direction="row" gap={2} alignItems="center">
                  <Avatar alt={tokenSymbol} src="/adminaccount.svg" />
                  <Box width="100%">
                    <Typography variant="overline" color="text.secondary">
                      <Trans>Admin Account</Trans>
                    </Typography>
                    <Typography component="span">
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${currentChain.blockExplorers?.default.url}/address/${admin}`}
                        display="flex"
                      >
                        <Stack
                          justifyContent="space-between"
                          alignItems="center"
                          direction="row"
                          width="100%"
                        >
                          {formatHash(admin, 5, 4)}
                          <OpenInNewIcon />
                        </Stack>
                      </Link>
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid item md={8} xs={12}>
                {isBalancerPool ? (
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography fontWeight={700}>
                        <Trans>LP {tokenSymbol}</Trans>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {isConnected ? (
                        hasLPBalance ? (
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => router.push(`/stake/${id}/add`)}
                          >
                            <Trans>Add Stake</Trans>
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() =>
                              window.open(balancerPoolLiquidityUrl, "_blank")
                            }
                          >
                            <Trans>Add Liquidity</Trans>
                          </Button>
                        )
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => open()}
                        >
                          <Trans>Connect Wallet</Trans>
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                ) : (
                  <Card sx={{ p: 2 }}>
                    <CardContent>
                      <Typography fontWeight={700}>
                        <Trans>Stake {tokenSymbol}</Trans>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {isConnected ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => router.push(`/stake/${id}/add`)}
                        >
                          <Trans>Add Stake</Trans>
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => open()}
                        >
                          <Trans>Connect Wallet</Trans>
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Collapse>
    </Card>
  );
}
