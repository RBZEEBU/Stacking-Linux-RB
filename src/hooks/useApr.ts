import { useCallback, useEffect, useMemo, useState } from "react";
import { readContract } from "@wagmi/core";
import { config } from "@/wagmiConfig";
import { Address, parseAbi } from "viem";
import { getTime, millisecondsToSeconds } from "date-fns";

const votingEscrowAbi = parseAbi([
  "function balanceOf(address owner, uint256 time) view returns (uint256)",
  "function totalSupply(uint256 time) view returns (uint256)",
]);

type UseAprHook__Type = {
  poolTokenBalance: bigint;
  totalSupply: bigint;
  weekApr: bigint;
  yearApr: bigint;
};

export const useApr = ({
  address,
  owner,
  totalWeekRewards,
  locked,
}: {
  address: Address;
  owner?: Address;
  totalWeekRewards: bigint;
  locked: bigint;
}): UseAprHook__Type => {
  const [poolTokenBalance, setPoolTokenBalance] = useState(BigInt(0));
  const [totalSupply, setTotalSupply] = useState(BigInt(0));

  const date = useMemo(() => new Date(), []);

  const currentTimeInSeconds = millisecondsToSeconds(getTime(date));

  const rate =
    totalSupply > BigInt(0)
      ? (poolTokenBalance * BigInt(10 ** 18)) / totalSupply
      : BigInt(0);

  const weekRewards = (totalWeekRewards * rate) / BigInt(10 ** 18);

  const weekApr =
    locked > BigInt(0) ? (weekRewards * BigInt(10 ** 18)) / locked : BigInt(0);

  const yearApr = weekApr * BigInt(52);

  const fetchPoolTokenBalance = useCallback(async () => {
    if (!owner) return BigInt(0);

    return await readContract(config, {
      address,
      abi: votingEscrowAbi,
      functionName: "balanceOf",
      args: [owner, BigInt(currentTimeInSeconds)],
    });
  }, [address, currentTimeInSeconds, owner]);

  const fetchTotalSupply = useCallback(async () => {
    return await readContract(config, {
      address,
      abi: votingEscrowAbi,
      functionName: "totalSupply",
      args: [BigInt(currentTimeInSeconds)],
    });
  }, [address, currentTimeInSeconds]);

  const fetch = useCallback(async () => {
    const [_poolTokenBalance, _totalSupply] = await Promise.all([
      fetchPoolTokenBalance(),
      fetchTotalSupply(),
    ]);

    setPoolTokenBalance(_poolTokenBalance);
    setTotalSupply(_totalSupply);
  }, [fetchPoolTokenBalance, fetchTotalSupply]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    poolTokenBalance,
    totalSupply,
    weekApr,
    yearApr,
  };
};
