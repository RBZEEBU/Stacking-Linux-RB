"use client";

import { useRouter } from "next/navigation";
import { useLingui } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import { Alert_Kind__Enum_Type, Pool__Type } from "@/types";
import { Avatar, Box, Card, Grid, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { ActionButton } from "./ActionButton";
import { AlertsContext } from "@/contexts/Alerts";
import { formatBalance, getNextEpoch } from "@/lib/utils";
import { usePools } from "@/hooks/usePools";
import Loader from "./Loader";
import { CONFIG } from "@/config";
import { Address } from "viem";
import { useClaim } from "@/hooks/useClaim";
import Countdown from "./Countdown";
import StakeInfo from "./StakeInfo";
import Modal from "./Modal";
import TransactionInfo from "./TransactionInfo";

type ClaimRewardsProps = {
  poolId: string;
};

export default function ClaimRewards(props: ClaimRewardsProps) {
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

  return <ClaimRewardsDetails pool={pool} />;
}

type ClaimRewardsDetailsProps = {
  pool: Pool__Type;
};

export function ClaimRewardsDetails(props: ClaimRewardsDetailsProps) {
  const { pool } = props;

  const router = useRouter();
  const { address: owner } = useAccount();
  const chainId = useChainId();
  const { i18n } = useLingui();
  const { showAlert } = useContext(AlertsContext);
  const [showModal, setShowModal] = useState(false);

  const lens = CONFIG.get(chainId)?.LENS_REWARD_CONTRACT! as Address;

  const { rewards, loading, claim } = useClaim({
    distributor: pool.rewardDistributorAddress,
    lens,
    owner,
    onSubmitted: () => {
      setShowModal(true);
    },
    onSuccess: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.SUCCESS,
        message: t(i18n)`You have successfully claimed the rewards`,
      });
    },
    onError: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.ERROR,
        message: t(i18n)`There was an error claiming the rewards`,
      });
    },
  });

  const claimableRewards =
    rewards?.claimInfo.map((claim) => {
      const rewardToken = pool.rewardTokens.find(
        (rt) => rt.address === claim.token.toLowerCase(),
      );
      return {
        ...claim,
        symbol: rewardToken?.symbol,
        decimals: rewardToken?.decimals,
        name: rewardToken?.name,
      };
    }) ?? [];

  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => router.push("/stake")}
        title={t(i18n)`Claim Rewards`}
        content={
          <TransactionInfo
            title={t(i18n)`Transaction Submitted`}
            description={t(
              i18n,
            )`Transaction for claim rewards has been submitted successfully`}
          />
        }
      />
      <Grid container mt={1} spacing={3} direction="row" justifyContent="center">
        <Grid item md={4} xs={12}>
          <StakeInfo pool={pool} />
        </Grid>
        <Grid item md={8} xs={12}>
          <Card
            sx={{
              p: 3,
              gap: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Typography fontWeight="bold" mb={2}>
              <Trans>Reward Tokens</Trans>
            </Typography>

            <Stack direction="column" width="100%" gap={2}>
              {claimableRewards.length > 0 ? (
                claimableRewards.map((reward, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: 1,
                      borderRadius: 1,
                      p: 2,
                      borderColor: "#ccc",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Stack gap={1} direction="row" alignItems="center">
                      <Avatar
                        src={
                          "/" +
                          reward.name?.toLocaleLowerCase().concat("-logo.svg")
                        }
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography>{reward.symbol}</Typography>
                    </Stack>
                    <Typography fontWeight="bold">
                      {formatBalance(
                        reward.amount,
                        Number(reward.decimals ?? 0),
                      )}{" "}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box
                  sx={{
                    border: 1,
                    borderRadius: 1,
                    p: 2,
                    borderColor: "#ccc",
                  }}
                >
                  <Typography color="textSecondary">
                    <Trans>No rewards available to claim at the moment.</Trans>
                  </Typography>
                </Box>
              )}
            </Stack>
            <Stack
              direction="row"
              gap={1}
              alignContent="center"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="overline">
                <Trans>Next epoch</Trans>
              </Typography>
              <Typography fontWeight="bold">
                <Countdown date={getNextEpoch()} />
              </Typography>
            </Stack>
            <ActionButton
              fullWidth
              loading={loading}
              onClick={() => claim()}
              disabled={claimableRewards.length === 0}
            >
              <Trans>Claim Rewards</Trans>
            </ActionButton>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
