"use client";

import { useRouter } from "next/navigation";
import { useLingui } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import { useToken } from "@/hooks/useToken";
import { Alert_Kind__Enum_Type, Pool__Type } from "@/types";
import {
  Alert,
  Box,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useChainId } from "wagmi";
import { ActionButton } from "./ActionButton";
import { AlertsContext } from "@/contexts/Alerts";
import { intlFormat, secondsToMilliseconds, toDate } from "date-fns";
import { formatBalance } from "@/lib/utils";
import { usePools } from "@/hooks/usePools";
import Loader from "./Loader";
import {
  CalculateEarlyUnlockPenaltyReturn__Type,
  useWithdrawEarly,
} from "@/hooks/useEarlyWithdraw";
import StakeInfo from "./StakeInfo";
import FormLabel from "./FormLabel";
import FormCard from "./FormCard";

type EarlyWithdrawProps = {
  poolId: string;
};

export default function EarlyWithdraw(props: EarlyWithdrawProps) {
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

  return <EarlyWithdrawDetails pool={pool} />;
}

type EarlyWithdrawDetailsProps = {
  pool: Pool__Type;
};

export function EarlyWithdrawDetails(props: EarlyWithdrawDetailsProps) {
  const { pool } = props;

  const router = useRouter();
  const { address: owner } = useAccount();
  const chainId = useChainId();
  const { i18n } = useLingui();
  const { showAlert } = useContext(AlertsContext);

  const { tokenSymbol, end } = pool;

  const [earlyWithdrawResult, setEarlyWithdrawResult] =
    useState<CalculateEarlyUnlockPenaltyReturn__Type>();
  const [earlyWithdrawResultSimulation, setEarlyWithdrawResultSimulation] =
    useState<CalculateEarlyUnlockPenaltyReturn__Type>();
  const [simulationTimestamp, setSimulationTimestamp] = useState<number>(
    Date.now(),
  );
  const [confirmChecked, setConfirmChecked] = useState<boolean>(false);

  const { fetchPool } = usePools({ account: owner, chainId });

  const { fetchBalance } = useToken({
    token: pool.tokenAddress,
    spender: pool.address,
    owner,
  });

  const {
    withdrawEarly,
    calculateEarlyUnlockPenalty,
    loading: isLoadingEarlyWithdraw,
  } = useWithdrawEarly({
    account: owner,
    address: pool.address,
    onSuccess: () => {
      fetchPool(pool.id);
      fetchBalance();
      showAlert({
        kind: Alert_Kind__Enum_Type.SUCCESS,
        message: t(i18n)`You have successfully early withdrawn ${formatBalance(
          BigInt(pool.yourStake),
          18,
        )} ${tokenSymbol}`,
      });
      router.push("/stake");
    },
    onSubmitted: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.PROGRESS,
        message: t(
          i18n,
        )`Early Withdrawing ${formatBalance(BigInt(pool.yourStake), 18)} ${tokenSymbol}`,
      });
    },
    onError: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.ERROR,
        message: t(i18n)`There was an error withdrawing the tokens`,
      });
    },
  });

  useEffect(() => {
    if (!owner) {
      return;
    }

    async function penalty() {
      const result = await calculateEarlyUnlockPenalty(Date.now() / 1000);
      setEarlyWithdrawResult(result);

      if (!earlyWithdrawResultSimulation) {
        setEarlyWithdrawResultSimulation(result);
      }
    }

    penalty();
  }, [owner, calculateEarlyUnlockPenalty, earlyWithdrawResultSimulation]);

  const calculateEarlyUnlockPenaltySimulation = useCallback(async () => {
    if (!owner) {
      return;
    }

    const result = await calculateEarlyUnlockPenalty(
      simulationTimestamp / 1000,
    );
    setEarlyWithdrawResultSimulation(result);
  }, [owner, calculateEarlyUnlockPenalty, simulationTimestamp]);

  function handleConfirmChange(
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ): void {
    setConfirmChecked(checked);
  }

  const minSimulationTimestamp = Date.now();
  const maxSimulationTimestamp = end * 1000;

  return (
    <Grid container mt={1} spacing={3} direction="row" justifyContent="center">
      <Grid item md={4} xs={12}> 
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
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Trans>
              Your lock period has not finished yet. You can early withdraw your{" "}
              {tokenSymbol} tokens by paying a penalty.
            </Trans>
          </Alert>

          <Box sx={{ mt: 2 }}>
            <FormLabel>
              <Trans>Overview</Trans>
            </FormLabel>
            <FormCard>
              <Stack direction="column" width="100%">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="overline">
                    <Trans>Unlocks</Trans>
                  </Typography>
                  <Typography variant="overline" fontWeight="bold">
                    {intlFormat(toDate(secondsToMilliseconds(end)))}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="overline">
                    <Trans>Stake</Trans>
                  </Typography>
                  <Typography variant="overline" fontWeight="bold">
                    {formatBalance(BigInt(pool.yourStake), 18)} {tokenSymbol}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="overline">
                    <Trans>Penalty</Trans>
                  </Typography>
                  <Typography variant="overline" fontWeight="bold">
                    {earlyWithdrawResult ? (
                      `${formatBalance(earlyWithdrawResult.penalty, 18)} ${tokenSymbol}`
                    ) : (
                      <CircularProgress size="1rem" />
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="overline">
                    <Trans>Penalty %</Trans>
                  </Typography>
                  <Typography variant="overline" fontWeight="bold">
                    {earlyWithdrawResult ? (
                      `${(earlyWithdrawResult.penaltyRatio * 100).toFixed(2)}%`
                    ) : (
                      <CircularProgress size="1rem" />
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="overline">
                    <Trans>Stake after penalty</Trans>
                  </Typography>
                  <Typography variant="overline" fontWeight="bold">
                    {earlyWithdrawResult ? (
                      `${formatBalance(earlyWithdrawResult.userAmount, 18)} ${tokenSymbol}`
                    ) : (
                      <CircularProgress size="1rem" />
                    )}
                  </Typography>
                </Box>
              </Stack>
            </FormCard>
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormLabel>
              <Trans>Simulate</Trans>
            </FormLabel>
            <FormCard>
              <Stack direction="column" width="100%">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="overline">
                    <Trans>Penalty</Trans>
                  </Typography>
                  <Typography variant="overline" fontWeight="bold">
                    {earlyWithdrawResultSimulation ? (
                      `${formatBalance(earlyWithdrawResultSimulation.penalty, 18)} ${tokenSymbol}`
                    ) : (
                      <CircularProgress size="1rem" />
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="overline">
                    <Trans>Penalty %</Trans>
                  </Typography>
                  <Typography variant="overline" fontWeight="bold">
                    {earlyWithdrawResultSimulation ? (
                      `${(earlyWithdrawResultSimulation.penaltyRatio * 100).toFixed(2)}%`
                    ) : (
                      <CircularProgress size="1rem" />
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="overline">
                    <Trans>Stake after penalty</Trans>
                  </Typography>
                  <Typography variant="overline" fontWeight="bold">
                    {earlyWithdrawResultSimulation ? (
                      `${formatBalance(earlyWithdrawResultSimulation.userAmount, 18)} ${tokenSymbol}`
                    ) : (
                      <CircularProgress size="1rem" />
                    )}
                  </Typography>
                </Box>
                <Box sx={{ width: "100%", pt: 4 }}>
                  <Slider
                    min={minSimulationTimestamp}
                    max={maxSimulationTimestamp}
                    aria-label={t(i18n)`Always visible`}
                    value={simulationTimestamp}
                    onChange={(_, value) => {
                      setSimulationTimestamp(value as number);
                    }}
                    onChangeCommitted={() =>
                      calculateEarlyUnlockPenaltySimulation()
                    }
                    valueLabelFormat={(v, i) =>
                      intlFormat(toDate(v), {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    }
                    marks={[
                      { value: minSimulationTimestamp, label: t(i18n)`Now` },
                      {
                        value: maxSimulationTimestamp,
                        label: t(i18n)`Unlock date`,
                      },
                    ]}
                    valueLabelDisplay="on"
                  />
                </Box>
              </Stack>
            </FormCard>
          </Box>
          <Stack width="100%">
            <FormControlLabel
              sx={{ mb: 2 }}
              control={
                <Checkbox
                  checked={confirmChecked}
                  onChange={handleConfirmChange}
                />
              }
              label={t(i18n)`I agree to pay the penalty`}
            />
            <ActionButton
              disabled={!confirmChecked}
              onClick={withdrawEarly}
              loading={isLoadingEarlyWithdraw}
            >
              <Trans>Early Withdraw</Trans>
            </ActionButton>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
