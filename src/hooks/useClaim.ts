import { useCallback, useEffect, useState } from "react";
import { Address, parseAbi, WaitForTransactionReceiptReturnType } from "viem";
import { readContract, writeContract } from "@wagmi/core";
import { config } from "@/wagmiConfig";
import { submitAction } from "@/lib/utils";

const rewardDistributorAbi = parseAbi([
  "struct ClaimInfo { address token; uint256 amount; }",
  "function claim(uint256[] rewardDistributionIds) returns (ClaimInfo[])",
]);

const lensAbi = parseAbi([
  "struct ClaimInfo { address token; uint256 amount; }",
  "function getClaimableRewards(address distributor, address user, uint256 pageNumber, uint256 perPage) view returns (uint256[],ClaimInfo[])",
]);

type Reward__Type = {
  rewardDistributionIds: bigint[];
  claimInfo: {
    token: Address;
    amount: bigint;
  }[];
};

type UseRewardsHook__Type = {
  rewards: Reward__Type | undefined;
  claim: () => Promise<void>;
  loading: boolean;
  //canClaim: boolean;
};

export const useClaim = ({
  distributor,
  lens,
  owner,
  onPrompt,
  onSubmitted,
  onSuccess,
  onError,
}: {
  distributor: Address;
  lens: Address;
  owner?: Address;
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
}): UseRewardsHook__Type => {
  const [rewards, setRewards] = useState<Reward__Type>();
  const [loading, setLoading] = useState(false);

  const claim = async () => {
    if (!owner) return;

    await submitAction(
      async () => {
        const rewardDistributorIds = rewards?.rewardDistributionIds ?? [];

        return await writeContract(config, {
          address: distributor,
          abi: rewardDistributorAbi,
          functionName: "claim",
          args: [rewardDistributorIds],
        });
      },
      {
        onPrompt: () => {
          setLoading(true);
          if (onPrompt) onPrompt();
        },
        onSubmitted,
        onSuccess: (receipt) => {
          setLoading(false);
          if (onSuccess) onSuccess(receipt);
        },
        onError: (err) => {
          setLoading(false);
          if (onError) onError(err);
        },
      },
    );
  };

  const fetchAvailableRewards = useCallback(async () => {
    if (!owner) return;

    try {
      const data = await readContract(config, {
        address: lens,
        abi: lensAbi,
        functionName: "getClaimableRewards",
        args: [distributor, owner, BigInt(0), BigInt(50)],
      });

      const [rewardDistributionIds, claimInfo] = data;

      const tokenBalances = claimInfo.reduce(
        (acc, ci) => {
          if (!acc[ci.token]) {
            acc[ci.token] = BigInt(0);
          }
          acc[ci.token] += ci.amount;
          return acc;
        },
        {} as Record<Address, bigint>,
      );

      const _rewards = {
        rewardDistributionIds: rewardDistributionIds.map((rdi) => BigInt(rdi)),
        claimInfo: Object.keys(tokenBalances).map((token) => ({
          token: token as Address,
          amount: tokenBalances[token as Address],
        })),
      };

      setRewards(_rewards);
    } catch (error) {
      console.error("Error fetching available rewards:", error);
    }
  }, [distributor, owner, lens]);

  useEffect(() => {
    fetchAvailableRewards();
  }, [fetchAvailableRewards]);

  return {
    rewards,
    claim,
    loading,
  };
};
