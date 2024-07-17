import { Trans } from "@lingui/macro";
import { formatBalance, formatBigInt, secondsInDays } from "@/lib/utils";
import { Pool__Type } from "@/types";
import {
  Avatar,
  Box,
  Card,
  Divider,
  Stack,
  Typography,
  TypographyOwnProps,
} from "@mui/material";
import {
  differenceInSeconds,
  format,
  getTime,
  secondsToMilliseconds,
} from "date-fns";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useRewards } from "@/hooks/useRewards";
import { useApr } from "@/hooks/useApr";
import { useMemo } from "react";
import DangerIcon from "./icons/DangerIcon";

const DetailText = (props: {
  children: React.ReactNode;
  typographyProps?: TypographyOwnProps;
}) => (
  <Typography textAlign="right" fontWeight={700} {...props.typographyProps}>
    {props.children}
  </Typography>
);

export default function StakeInfo({
  pool,
  showImage = true,
}: {
  pool: Pool__Type;
  showImage?: boolean;
}) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { data } = useBalance({ address, chainId, token: pool.address });

  const currentTime = useMemo(() => new Date(), []);
  const isUnlocked = currentTime.getTime() > pool.end * 1000;
  const yourStakeAmount = BigInt(pool.yourStake);
  const currentUnlockTime = new Date(secondsToMilliseconds(pool.end));
  const durationInSeconds = differenceInSeconds(currentUnlockTime, currentTime);

  const { total } = useRewards({
    pool,
    timestamp: getTime(currentTime),
    chainId,
  });

  const { yearApr } = useApr({
    address: pool.address,
    owner: address,
    totalWeekRewards: total,
    locked: yourStakeAmount,
  });

  if (!data) return null;

  return (
    <Card>
      <Stack direction="column" width="100%" p={0}>
        <Box
          sx={{
            padding: "30px",
            position: "relative",
          }}
        >
          {isUnlocked ? (
            <Stack
              alignItems="center"
              spacing={1}
              direction="row"
              sx={{
                backgroundColor: "primary.light",
                color: "primary.contrastText",
                borderRadius: 1,
                borderBottomRightRadius: 0,
                borderTopLeftRadius: 0,
                px: 2,
                py: 0.5,
                position: "absolute",
                top: 0,
                right: 0,
              }}
            >
              <DangerIcon />
              <Typography>
                <Trans>Unlocked</Trans>
              </Typography>
            </Stack>
          ) : null}
          <Box display="flex">
            <Avatar src="/zeebu-logo.svg" />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                paddingLeft: 1,
              }}
            >
              <Typography>
                <Trans>My {data.symbol}</Trans>
              </Typography>
              <Typography fontSize={16} fontWeight="bold">
                {formatBigInt(data.value, Number(data.decimals))} {data.symbol}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ borderColor: "#ccc" }} />
        <Box
          sx={{
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>
              <Trans>Est. APY</Trans>
            </Typography>
            <DetailText>{formatBalance(yearApr, 18, 2)}%</DetailText>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography>
              <Trans>{pool.tokenSymbol} locked</Trans>
            </Typography>
            <DetailText>
              {formatBalance(yourStakeAmount, Number(pool.decimals))}{" "}
              {pool.tokenSymbol}
            </DetailText>
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
            <DetailText>
              {isUnlocked ? (
                "-"
              ) : (
                <Trans>
                  {Math.floor(secondsInDays(durationInSeconds))} days
                </Trans>
              )}
            </DetailText>
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
            {isUnlocked ? (
              <Stack>
                <DetailText typographyProps={{ color: "primary.light" }}>
                  <Trans>Unlocked</Trans>
                </DetailText>
                {format(currentUnlockTime, "MMM dd yyyy HH:mm")}
              </Stack>
            ) : (
              <DetailText>
                {format(currentUnlockTime, "MMM dd yyyy HH:mm")}
              </DetailText>
            )}
          </Box>
        </Box>

        {showImage ? (
          <Box display="flex" justifyContent="center">
            <img
              src="/zbu-coins.png"
              alt="zeebu-logo"
              style={{ maxWidth: 265, maxHeight: 336 }}
            />
          </Box>
        ) : null}
      </Stack>
    </Card>
  );
}
