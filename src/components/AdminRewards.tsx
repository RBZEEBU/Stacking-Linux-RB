"use client";

import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useLingui } from "@lingui/react";
import { Trans, t } from "@lingui/macro";
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Card,
  Stack,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  TextField,
  Alert,
  Link,
  CardHeader,
  CardContent,
  Container,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useAccount, useChainId } from "wagmi";
import { usePools } from "@/hooks/usePools";
import { getTokenBalance } from "@/hooks/useToken";
import { Address, isAddress, parseUnits } from "viem";
import { RewardDistribution, useAdminRewards } from "@/hooks/useAdminRewards";
import { ActionButton } from "./ActionButton";
import { UTCDate } from "@date-fns/utc";
import {
  Day,
  eachDayOfInterval,
  eachHourOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  getDay,
  isPast,
  lightFormat,
  roundToNearestHours,
} from "date-fns";
import { AddTokenModal, Token } from "./AddTokenModal";
import { formatBalance, panic, secondsInDate } from "@/lib/utils";
import { useTokenApprove } from "@/hooks/useTokenApprove";
import { Alert_Kind__Enum_Type, Pool__Type } from "@/types";
import { AlertsContext } from "@/contexts/Alerts";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import RadioButton from "./RadioButton";
import CalendarIcon from "./icons/CalendarIcon";

const AdminRewards = () => {
  const { i18n } = useLingui();
  const { showAlert } = useContext(AlertsContext);
  const [rewardType, setRewardType] = useState<"single" | "multiple">("single");
  const [rewardDistributions, setRewardDistributions] = useState<
    RewardDistribution[]
  >([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [addTokenModalOpened, setAddTokenModalOpened] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token>();
  const [selectedTokenBalance, setSelectedTokenBalance] = useState<string>();
  const [frequency, setFrequency] = useState<"hour" | "day" | "week" | "year">(
    "hour",
  );
  const [rewardDate, setRewardDate] = useState<Date | null>(
    roundToNearestHours(new UTCDate(), {
      nearestTo: 1,
      roundingMethod: "ceil",
    }),
  );
  const [rewardDateFrom, setRewardDateFrom] = useState<Date | null>(
    roundToNearestHours(new UTCDate(), {
      nearestTo: 1,
      roundingMethod: "ceil",
    }),
  );
  const [rewardDateTo, setRewardDateTo] = useState<Date | null>(
    roundToNearestHours(new UTCDate(), {
      nearestTo: 8,
      roundingMethod: "ceil",
    }),
  );
  const [inputAmount, setInputAmount] = useState<string>("");
  const [amount, setAmount] = useState<number | undefined>();
  const { address: account } = useAccount();
  const chainId = useChainId();
  const { fetchPools } = usePools({ account, chainId });
  const [pools, setPools] = useState<Pool__Type[]>([]);

  const [poolIndex, setPoolIndex] = useState<number>(0);
  const [hasRole, setHasRole] = useState<boolean | undefined>();

  useEffect(() => {
    fetchPools().then((pools) => setPools(pools));
  }, [fetchPools]);

  const resetForm = () => {
    setRewardDistributions([]);
    setAddTokenModalOpened(false);
    setSelectedToken(undefined);
    setSelectedTokenBalance(undefined);
    setFrequency("hour");
    setRewardDate(
      roundToNearestHours(new UTCDate(), {
        nearestTo: 1,
        roundingMethod: "ceil",
      }),
    );
    setRewardDateFrom(
      roundToNearestHours(new UTCDate(), {
        nearestTo: 1,
        roundingMethod: "ceil",
      }),
    );
    setRewardDateTo(
      roundToNearestHours(new UTCDate(), {
        nearestTo: 8,
        roundingMethod: "ceil",
      }),
    );
    setInputAmount("");
    setAmount(undefined);
  };

  const pool = pools[poolIndex];

  const {
    addRewardDistributions,
    addRewardDistribution,
    addingRewardDistribution,
    hasRewardDistributorRole,
  } = useAdminRewards({
    rewardDistributorAddress: pool?.rewardDistributorAddress,
    onSubmitted: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.PROGRESS,
        message: t(i18n)`Adding rewards`,
      });
    },
    onSuccess: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.SUCCESS,
        message: t(i18n)`Successfully added rewards`,
      });
      resetForm();
    },
    onError: (error: any) => {
      const noTotalSupplyError =
        "message" in error &&
        error.message.includes("RewardDistributor__NoTotalSupply");

      let message = t(i18n)`There was an error adding the rewards`;

      if (noTotalSupplyError) {
        message = t(
          i18n,
        )`There was an error adding the rewards. You can't add past rewards if the total supply was 0`;
      }

      showAlert({
        kind: Alert_Kind__Enum_Type.ERROR,
        message: message,
      });
    },
  });

  useEffect(() => {
    if (account && pool) {
      hasRewardDistributorRole(account).then(setHasRole);
    }
  }, [account, hasRewardDistributorRole, pool]);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  useEffect(() => {
    if (pool) {
      setTokens(
        pool.rewardTokens.map((rewardToken) => ({
          address: rewardToken.address,
          name: rewardToken.name,
          symbol: rewardToken.symbol,
          decimals: Number(rewardToken.decimals),
        })) as Token[],
      );
      setSelectedToken(undefined);
      setRewardDistributions([]);
    }
  }, [pool]);

  const handleAddToken = async (token: Token) => {
    const adaptedToken: Token = {
      ...token,
      address: token.address.toLowerCase() as Address,
    };
    const existingToken = tokens.find(
      (t) => t.address === adaptedToken.address,
    );

    if (!existingToken) {
      setTokens([...tokens, adaptedToken]);
    }

    setSelectedToken(adaptedToken);
    setAddTokenModalOpened(false);
    setRewardDistributions([]);
  };

  const handleAmountChanged: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const _value = e.currentTarget.value;

    setInputAmount(_value);
    setAmount(_value === "" ? 0 : parseFloat(_value));
    setRewardDistributions([]);
  };

  useEffect(() => {
    if (selectedToken && isAddress(selectedToken.address) && account) {
      getTokenBalance(selectedToken?.address, account).then((balance) => {
        setSelectedTokenBalance(
          formatBalance(balance, selectedToken?.decimals),
        );
      });
    }
  }, [selectedToken, account]);

  const bigintAmount = parseUnits(
    amount?.toString() || "0",
    selectedToken?.decimals || 0,
  );

  const handlePreviewRewards = () => {
    let dates: Date[] = [];
    switch (frequency) {
      case "hour": {
        dates = eachHourOfInterval({
          start: rewardDateFrom!,
          end: rewardDateTo!,
        });
        break;
      }
      case "day": {
        dates = eachDayOfInterval({
          start: rewardDateFrom!,
          end: rewardDateTo!,
        });
        break;
      }
      case "week": {
        dates = eachWeekOfInterval(
          {
            start: rewardDateFrom!,
            end: rewardDateTo!,
          },
          { weekStartsOn: getDay(rewardDateFrom!) as Day },
        );
        break;
      }
      case "year": {
        dates = eachYearOfInterval({
          start: rewardDateFrom!,
          end: rewardDateTo!,
        });
        break;
      }
      default:
        panic("Invalid frequency");
    }

    const rewardDistributions = dates.map((date) => ({
      rewardTimestamp: Math.floor(date.getTime() / 1000),
      token: selectedToken!.address,
      amount: bigintAmount / BigInt(dates.length),
    }));

    setRewardDistributions(rewardDistributions);
  };

  const handleAddReward = async () => {
    if (rewardType === "single") {
      addRewardDistribution({
        rewardTimestamp: Math.floor(rewardDate!.getTime() / 1000),
        token: selectedToken!.address,
        amount: bigintAmount,
      });
    } else {
      addRewardDistributions(rewardDistributions);
    }
  };

  const { balance } = useTokenBalance({
    token: selectedToken?.address,
    address: account,
  });

  const {
    allowance,
    approve,
    loading: loadingApprove,
  } = useTokenApprove({
    token: selectedToken?.address,
    owner: account,
    spender: pool?.rewardDistributorAddress,
    onSubmitted: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.PROGRESS,
        message: t(i18n)`Approving tokens`,
      });
    },
    onSuccess: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.SUCCESS,
        message: t(i18n)`You have successfully approved the tokens`,
      });
    },
    onError: () => {
      showAlert({
        kind: Alert_Kind__Enum_Type.ERROR,
        message: t(i18n)`There was an error approving the tokens`,
      });
    },
  });

  const lowBalance = bigintAmount > balance;
  const canAddRewards =
    bigintAmount &&
    bigintAmount > 0 &&
    allowance >= bigintAmount &&
    !lowBalance &&
    selectedToken &&
    hasRole;
  const canPreviewRewards =
    bigintAmount && bigintAmount > 0 && selectedToken && hasRole;

  return (
    <>
      {addTokenModalOpened && (
        <AddTokenModal
          open={true}
          onCancel={() => setAddTokenModalOpened(false)}
          onConfirm={handleAddToken}
          existingTokens={tokens}
        />
      )}
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ width: "770px", padding: "30px" }}>
          <Stack gap={2}>
            <FormControl>
              <FormLabel
                id="reward-type"
                sx={{
                  color: "text.primary",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                <Trans>Reward Type</Trans>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="reward-type"
                name="reward-type"
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value as any)}
              >
                <FormControlLabel
                  value="single"
                  control={<RadioButton />}
                  label={t(i18n)`Single`}
                />
                <FormControlLabel
                  value="multiple"
                  control={<RadioButton />}
                  label={t(i18n)`Multiple`}
                />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel id="pool-label">
                <Trans>Pool</Trans>
              </FormLabel>
              <Select
                displayEmpty
                value={poolIndex}
                onChange={(e) => setPoolIndex(Number(e.target.value))}
                renderValue={(idx) => pools[idx]?.name ?? t(i18n)`Select Pool`}
              >
                {pools.map((pool, index) => (
                  <MenuItem key={index} value={String(index)}>
                    {pool.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel id="token-label">
                <Trans>Reward Token</Trans>
              </FormLabel>
              <Select
                displayEmpty
                value={selectedToken?.address || ""}
                renderValue={(address) =>
                  tokens.find((t) => t.address === address)?.name ??
                  t(i18n)`Select Reward Token`
                }
                onChange={(e) =>
                  setSelectedToken(
                    tokens.find((t) => t.address == e.target.value),
                  )
                }
              >
                {tokens.map((token, index) => (
                  <MenuItem key={index} value={token.address}>
                    {token.name || token.address}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText onClick={() => setAddTokenModalOpened(true)}>
                <Link sx={{ cursor: "pointer" }}>
                  <Trans>Add new token</Trans>
                </Link>
              </FormHelperText>
            </FormControl>
            {rewardType === "single" ? (
              <FormControl>
                <FormLabel id="utc-date-label">
                  <Trans>UTC Date</Trans>
                </FormLabel>
                <DateTimePicker
                  slots={{ openPickerIcon: CalendarIcon }}
                  sx={{
                    "& .MuiIconButton-root": {
                      marginRight: "1px",
                    },
                  }}
                  value={rewardDate}
                  onChange={(newValue) => setRewardDate(newValue)}
                  timezone="UTC"
                />
              </FormControl>
            ) : (
              <Stack gap={2} direction="row">
                <Box>
                  <FormLabel id="utc-date-from-label">
                    <Trans>UTC Date From</Trans>
                  </FormLabel>
                  <FormControl fullWidth>
                    <DateTimePicker
                      slots={{ openPickerIcon: CalendarIcon }}
                      sx={{
                        "& .MuiIconButton-root": {
                          marginRight: "1px",
                        },
                      }}
                      value={rewardDateFrom}
                      onChange={(newValue) => {
                        setRewardDateFrom(newValue);
                        setRewardDistributions([]);
                      }}
                      timezone="UTC"
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormLabel id="utc-date-to-label">
                    <Trans>UTC Date To</Trans>
                  </FormLabel>
                  <FormControl fullWidth>
                    <DateTimePicker
                      slots={{ openPickerIcon: CalendarIcon }}
                      sx={{
                        "& .MuiIconButton-root": {
                          marginRight: "1px",
                        },
                      }}
                      value={rewardDateTo}
                      onChange={(newValue) => {
                        setRewardDateTo(newValue);
                        setRewardDistributions([]);
                      }}
                      timezone="UTC"
                    />
                  </FormControl>
                </Box>
              </Stack>
            )}
            {rewardType === "multiple" && (
              <FormControl>
                <FormLabel id="frequency-label">
                  <Trans>Frequency</Trans>
                </FormLabel>
                <Select
                  value={frequency}
                  onChange={(e) => {
                    setFrequency(e.target.value as any);
                    setRewardDistributions([]);
                  }}
                  placeholder={t(i18n)`Select frequency`}
                >
                  <MenuItem value="hour">
                    <Trans>Hour</Trans>
                  </MenuItem>
                  <MenuItem value="day">
                    <Trans>Day</Trans>
                  </MenuItem>
                  <MenuItem value="week">
                    <Trans>Week</Trans>
                  </MenuItem>
                  <MenuItem value="year">
                    <Trans>Year</Trans>
                  </MenuItem>
                </Select>
              </FormControl>
            )}
            <FormControl>
              <FormLabel id="amount-label">
                <Trans>Amount</Trans>
              </FormLabel>
              <TextField
                placeholder={t(i18n)`Enter amount`}
                fullWidth
                value={inputAmount}
                onChange={handleAmountChanged}
                type="number"
                inputProps={{ min: 0, step: 0.1 }}
                disabled={!selectedToken}
              />
              {selectedToken && (
                <Typography textAlign="right" mt={1}>
                  <Trans>
                    Balance: {selectedTokenBalance} {selectedToken.symbol}
                  </Trans>
                </Typography>
              )}
            </FormControl>

            {lowBalance ? (
              <Alert severity="warning">
                <Trans>Not enough balance</Trans>
              </Alert>
            ) : null}

            {rewardType === "single" && rewardDate && isPast(rewardDate) ? (
              <Alert severity="warning">
                <Trans>
                  The reward date is set in the past. This means the reward will
                  be instantly claimable. Please set a future date if you want
                  to delay the claimability.
                </Trans>
              </Alert>
            ) : null}

            {rewardDistributions.some((rewardDistribution) =>
              isPast(secondsInDate(rewardDistribution.rewardTimestamp)),
            ) ? (
              <Alert severity="warning">
                <Trans>
                  Some rewards are set in the past. This means the reward will
                  be instantly claimable. Please set a future date if you want
                  to delay the claimability. Also, you can&apos;t add past
                  rewards if the total supply was 0 at that time.
                </Trans>
              </Alert>
            ) : null}

            {hasRole === false ? (
              <Alert severity="error">
                <Trans>
                  You don&apos;t have the required role to add rewards
                </Trans>
              </Alert>
            ) : null}

            {rewardType === "multiple" && rewardDistributions.length ? (
              <Card>
                <CardHeader title={t(i18n)`Reward Distribution Overview`} />
                <CardContent>
                  <Typography>
                    <Trans>
                      {rewardDistributions.length} rewards will be added, each
                      having {formatBalance(rewardDistributions[0].amount, 18)}{" "}
                      {selectedToken?.symbol}
                    </Trans>
                  </Typography>
                  <Typography>
                    {rewardDistributions
                      .map((rewardDistribution) =>
                        lightFormat(
                          secondsInDate(rewardDistribution.rewardTimestamp),
                          "yyyy-MM-dd hh:mm a",
                        ),
                      )
                      .join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            ) : null}

            {allowance < bigintAmount && (
              <ActionButton
                onClick={() => approve(bigintAmount)}
                loading={loadingApprove}
                disabled={lowBalance || !hasRole}
              >
                <Trans>Approve {selectedToken?.symbol}</Trans>
              </ActionButton>
            )}

            {rewardType === "multiple" && rewardDistributions.length === 0 ? (
              <ActionButton
                onClick={handlePreviewRewards}
                disabled={!canPreviewRewards}
              >
                <Trans>Preview Rewards</Trans>
              </ActionButton>
            ) : allowance >= bigintAmount ? (
              <ActionButton
                onClick={handleAddReward}
                loading={addingRewardDistribution}
                disabled={!canAddRewards}
              >
                <Trans>Add Rewards</Trans>
              </ActionButton>
            ) : null}
          </Stack>
        </Card>
      </Container>
    </>
  );
};

export default AdminRewards;
