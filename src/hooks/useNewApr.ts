import { useCallback, useEffect, useMemo, useState } from "react";
import { readContract } from "@wagmi/core";
import { config } from "@/wagmiConfig";
import { Address, parseAbi } from "viem";
import { getTime, millisecondsToSeconds } from "date-fns";

const votingEscrowAbi = parseAbi([
  "function totalSupply(uint256 time) view returns (uint256)",
]);

type UseNewAprHook__Type = {
  totalSupply: bigint;
  weekApr: bigint;
  yearApr: bigint;
};

export const useNewApr = ({
  address,
  amount,
  durationInSeconds,
  totalWeekRewards,
  maxTimeLock,
}: {
  address: Address;
  amount: bigint;
  durationInSeconds: number;
  totalWeekRewards: bigint;
  maxTimeLock: bigint;
}): UseNewAprHook__Type => {
  const [totalSupply, setTotalSupply] = useState(BigInt(0));

  const expectedBalance =
    maxTimeLock > BigInt(0)
      ? (amount * BigInt(durationInSeconds)) / maxTimeLock
      : BigInt(0);

  const date = useMemo(() => new Date(), []);

  const currentTimeInSeconds = millisecondsToSeconds(getTime(date));

  const rate =
    totalSupply > BigInt(0)
      ? (expectedBalance * BigInt(10 ** 18)) / (totalSupply + expectedBalance)
      : BigInt(0);

  const weekRewards = (totalWeekRewards * rate) / BigInt(10 ** 18);

  const weekApr =
    amount > BigInt(0)
      ? (weekRewards * BigInt(10 ** 18) * BigInt(100)) / amount
      : BigInt(0);

  const yearApr = weekApr * BigInt(52);

  const fetchTotalSupply = useCallback(async () => {
    return await readContract(config, {
      address,
      abi: votingEscrowAbi,
      functionName: "totalSupply",
      args: [BigInt(currentTimeInSeconds)],
    });
  }, [address, currentTimeInSeconds]);

  const fetch = useCallback(async () => {
    const _totalSupply = await fetchTotalSupply();
    setTotalSupply(_totalSupply);
  }, [fetchTotalSupply]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    totalSupply,
    weekApr,
    yearApr,
  };
};
