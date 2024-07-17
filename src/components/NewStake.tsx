"use client";

import { useRouter } from "next/navigation";
import { useLingui } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import { useToken } from "@/hooks/useToken";
import { useStake } from "@/hooks/useStake";
import { Alert_Kind__Enum_Type, Pool__Type } from "@/types";
import {
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { ActionButton } from "./ActionButton";
import { AlertsContext } from "@/contexts/Alerts";
import { useNewApr } from "@/hooks/useNewApr";
import { useRewards } from "@/hooks/useRewards";
import { addSeconds, format, getTime } from "date-fns";
import { PeriodSelector } from "./PeriodSelector";
import { formatBalance, formatBigInt, secondsInDays } from "@/lib/utils";
import { secondsInWeek } from "date-fns/constants";
import { usePools } from "@/hooks/usePools";
import Loader from "./Loader";
import FormCard from "./FormCard";
import FormLabel from "./FormLabel";
import RewardTokenIcon from "./icons/RewardTokenIcon";
import TokenInput from "./TokenInput";

type NewStakeProps = {
  poolId: string;
};

export default function NewStake(props: NewStakeProps) {
  const { poolId } = props;

  const { address: owner } = useAccount();
  const chainId = useChainId();
  const [pool, setPool] = useState<Pool__Type | null>(null);
  const { fetchPool } = usePools({ account: owner, chainId });

  useEffect(() => {
    fetchPool(poolId).then((pool) => setPool(pool));
  }, [fetchPool, poolId]);

  if (!pool) {
    return <Loader />;
  }

  return <NewStakeDetails pool={pool} />;
}

type NewStakeDetailsProps = {
  pool: Pool__Type;
};

export function NewStakeDetails(props: NewStakeDetailsProps) {
  const { pool } = props;

  const router = useRouter();
  const { address: owner } = useAccount();
  const chainId = useChainId();
  const { showAlert } = useContext(AlertsContext);
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const [duration, setDuration] = useState<number>(secondsInWeek);
  const { i18n } = useLingui();

  const {
    rewardTokens,
    address,
    decimals,
    tokenAddress,
    tokenSymbol,
    yourStake,
  } = pool;

  const formattedAmount = formatBigInt(amount, Number(decimals));

  const periodEnds = useMemo(() => {
    return addSeconds(new Date(), duration);
  }, [duration]);

  const bigintUnlockTime = BigInt(Math.floor(periodEnds.getTime() / 1000));

  const {
    allowance,
    approve,
    loading: approveLoading,
    balance,
  } = useToken({
    token: tokenAddress,
    owner,
    spender: address,
    amount,
    onSubmitted: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.PROGRESS,
        message: t(i18n)`Approving ${formattedAmount} ${tokenSymbol}`,
      });
    },
    onSuccess: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.SUCCESS,
        message: t(
          i18n,
        )`Successfully approved ${formattedAmount} ${tokenSymbol}`,
      });
    },
    onError: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.ERROR,
        message: t(i18n)`There was an error approving the tokens`,
      });
    },
  });

  const { loading, stake } = useStake({
    address,
    amount: BigInt(yourStake),
    onSuccess: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.SUCCESS,
        message: t(i18n)`Successfully staked ${formattedAmount} ${tokenSymbol}`,
      });
      router.push("/stake");
    },
    onSubmitted: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.PROGRESS,
        message: t(i18n)`Staking ${formattedAmount} ${tokenSymbol}`,
      });
    },
    onError: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.ERROR,
        message: t(i18n)`There was an error staking the tokens`,
      });
    },
  });

  const currentTime = useMemo(() => new Date(), []);

  const { total } = useRewards({
    pool,
    timestamp: getTime(currentTime),
    chainId,
  });

  const { yearApr: newApr } = useNewApr({
    address: pool.address,
    amount,
    durationInSeconds: duration,
    totalWeekRewards: total,
    maxTimeLock: BigInt(pool.maxLockTime),
  });

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          mt: 3,
          p: 3,
          gap: 3,
          display: "flex",
          flexDirection: "column",
          maxWidth: "770px",
        }}
      >
        <Box>
          <FormLabel>
            <Trans>Add Details</Trans>
          </FormLabel>
          <FormCard sx={{ gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item width="100%" md={6}>
                <TokenInput
                  amount={amount}
                  setAmount={setAmount}
                  balance={balance}
                  decimals={Number(decimals)}
                />
              </Grid>
              <Grid item width="100%" md={6}>
                <PeriodSelector
                  onChange={(value) => {
                    setDuration(value);
                  }}
                  value={duration}
                  label=""
                />
              </Grid>
            </Grid>
          </FormCard>
        </Box>
        <Box>
          <FormLabel>
            <Trans>Summary</Trans>
          </FormLabel>
          <FormCard sx={{ display: "flex", gap: 3 }}>
            <Stack direction="column" width="100%" gap={1} p={1}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  <Trans>Est. APY</Trans>
                </Typography>
                <Typography fontWeight="bold">
                  {formatBalance(newApr, 18, 2)}%
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  <Trans>{tokenSymbol} locked</Trans>
                </Typography>
                <Typography fontWeight="bold">
                  {amount ? formattedAmount : "-"} {tokenSymbol}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  <Trans>Duration</Trans>
                </Typography>
                <Typography fontWeight="bold">
                  <Trans>{Math.floor(secondsInDays(duration))} days</Trans>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>
                  <Trans>Unlock on</Trans>
                </Typography>
                <Typography fontWeight="bold">
                  {format(periodEnds, "MMM dd yyyy HH:mm")}
                </Typography>
              </Box>
            </Stack>
          </FormCard>
        </Box>
        <Box>
          <FormLabel>
            <Trans>You Earn</Trans>
          </FormLabel>
          <FormCard sx={{ display: "flex" }}>
            <Stack
              direction="row"
              width="100%"
              gap={3}
              justifyContent="space-between"
              alignItems="center"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={(theme) => ({
                    height: "20px",
                    borderColor: theme.palette.text.primary,
                    alignSelf: "center",
                  })}
                />
              }
            >
              {rewardTokens.map((reward, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {reward.symbol === "ZBU" ? (
                      <Avatar
                        src={`/${reward.name.toLocaleLowerCase()}-logo.svg`}
                        sx={{ width: 24, height: 24 }}
                      />
                    ) : (
                      <RewardTokenIcon />
                    )}
                    <Typography variant="overline">
                      {formatBigInt(
                        BigInt(reward.availableRewardAmount),
                        Number(reward.decimals),
                      )}{" "}
                      {reward.symbol}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </FormCard>
        </Box>
        {allowance < amount && balance >= amount ? (
          <ActionButton onClick={approve} loading={loading || approveLoading}>
            <Trans>Approve</Trans>
          </ActionButton>
        ) : (
          <ActionButton
            onClick={async () => {
              await stake(amount, bigintUnlockTime);
            }}
            loading={loading || approveLoading}
            disabled={!amount || amount === BigInt(0)}
          >
            <Trans>Add Stake</Trans>
          </ActionButton>
        )}
      </Card>
    </Box>
  );
}
