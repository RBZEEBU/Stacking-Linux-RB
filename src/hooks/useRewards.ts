import { CONFIG } from "@/config";
import { Reward__Type } from "@/lib/subgraph";
import { Pool__Type } from "@/types";
import { addWeeks, getTime, millisecondsToSeconds } from "date-fns";
import { useCallback, useEffect, useState } from "react";

type UseRewardsHook__Type = {
  rewards: Reward__Type[];
  loading: boolean;
  total: bigint;
};

export const useRewards = ({
  pool,
  timestamp,
  chainId,
}: {
  pool: Pool__Type;
  timestamp: number;
  chainId: number;
}): UseRewardsHook__Type => {
  const [rewards, setRewards] = useState<Reward__Type[]>([]);
  const [loading, setLoading] = useState(false);

  const zbuAddress = CONFIG.get(chainId)?.ZBU_CONTRACT!;

  const total = rewards
    .filter((reward) => reward.token === zbuAddress.toLowerCase())
    .reduce((m, v) => m + BigInt(v.unclaimedAmount), BigInt(0));

  const fetchRewards = useCallback(async () => {
    const nextWeek = addWeeks(new Date(timestamp), 1);
    const nextWeekTimestamp = millisecondsToSeconds(getTime(nextWeek));

    setLoading(true);
    const resp = await fetch(
      `/api/pools/${pool.id}/rewards?timestamp=${nextWeekTimestamp}&chainId=${chainId}`,
    );
    const { data } = await resp.json();
    setRewards(data);

    setLoading(false);
  }, [chainId, pool.id, timestamp]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return {
    rewards,
    loading,
    total,
  };
};
