"use client";

import { useRouter } from "next/navigation";
import { useLingui } from "@lingui/react";
import { t, Trans } from "@lingui/macro";
import { useToken } from "@/hooks/useToken";
import { useStake } from "@/hooks/useStake";
import { Alert_Kind__Enum_Type, Pool__Type } from "@/types";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { ActionButton } from "./ActionButton";
import { AlertsContext } from "@/contexts/Alerts";
import { useNewApr } from "@/hooks/useNewApr";
import { useRewards } from "@/hooks/useRewards";
import {
  addSeconds,
  format,
  getTime,
  millisecondsToSeconds,
  secondsToMilliseconds,
} from "date-fns";
import { PeriodSelector } from "./PeriodSelector";
import {
  formatBalance,
  formatBigInt,
  getUnlockTime,
  secondsInDays,
} from "@/lib/utils";
import { secondsInWeek } from "date-fns/constants";
import { usePools } from "@/hooks/usePools";
import Loader from "./Loader";
import StakeInfo from "./StakeInfo";
import FormCard from "./FormCard";
import FormLabel from "./FormLabel";
import TokenInput from "./TokenInput";

type NewStakeProps = {
  poolId: string;
};

export default function AddExtendStake(props: NewStakeProps) {
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

  return <AddExtendStakeDetails pool={pool} />;
}

type AddExtendStakeDetailsProps = {
  pool: Pool__Type;
};

export function AddExtendStakeDetails(props: AddExtendStakeDetailsProps) {
  const { pool } = props;

  const router = useRouter();
  const { address: owner } = useAccount();
  const chainId = useChainId();
  const { showAlert } = useContext(AlertsContext);
  const [amount, setAmount] = useState<bigint>(BigInt(0));
  const [duration, setDuration] = useState<number>(secondsInWeek);
  const { i18n } = useLingui();

  const {
    address,
    decimals,
    tokenAddress,
    tokenSymbol,
    yourStake,
    stake: stakeAmount,
    maxLockTime: maxLockTimeInSeconds,
  } = pool;

  const yourStakeAmount = BigInt(yourStake);
  const formattedAmount = formatBigInt(amount, Number(decimals));

  const periodEnds = useMemo(() => {
    return addSeconds(new Date(), duration);
  }, [duration]);

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

  const { loading, increaseAmount } = useStake({
    address,
    amount: yourStakeAmount,
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

  const currentUnlockTime = new Date(secondsToMilliseconds(pool.end));

  const maxLockTime = addSeconds(new Date(), maxLockTimeInSeconds);

  const newUnlockTime = getUnlockTime(currentUnlockTime, duration);
  const bigintUnlockTime = BigInt(
    millisecondsToSeconds(getTime(newUnlockTime)),
  );

  const canExtend = newUnlockTime < maxLockTime;

  const { increasePeriod, loading: extendLoading } = useStake({
    amount: BigInt(stakeAmount),
    address,
    onSubmitted: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.PROGRESS,
        message: t(i18n)`Extending staking period`,
      });
    },
    onSuccess: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.SUCCESS,
        message: t(i18n)`Staking period successfully extended`,
      });
      router.push("/stake");
    },
    onError: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.ERROR,
        message: t(i18n)`There was an error extending the period`,
      });
    },
  });

  return (
    <Grid container mt={1} spacing={3} direction="row" justifyContent="center">
      <Grid item md={4} xs={12} >
        <StakeInfo pool={pool} />
      </Grid>
      <Grid item md={8} xs={12}>
        <Card
          sx={{
            p: 3,
            gap: 3,
            display: "flex",
            flexDirection: "column",
            height: "100%",
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
            <FormCard sx={{ gap: 3 }}>
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
          <Stack direction="row" gap={2}>
            {allowance < amount && balance >= amount ? (
              <ActionButton
                onClick={approve}
                loading={loading || approveLoading}
              >
                <Trans>Approve</Trans>
              </ActionButton>
            ) : (
              <ActionButton
                onClick={async () => {
                  await increaseAmount(amount);
                }}
                loading={loading || approveLoading}
                disabled={!amount || amount === BigInt(0) || amount > balance}
              >
                <Trans>Add {tokenSymbol}</Trans>
              </ActionButton>
            )}
            <ActionButton
              onClick={() => increasePeriod(bigintUnlockTime)}
              loading={extendLoading}
              disabled={!canExtend}
            >
              <Trans>Extend Lock</Trans>
            </ActionButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
