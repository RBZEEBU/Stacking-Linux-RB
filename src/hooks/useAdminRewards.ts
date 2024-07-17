import { panic, submitAction } from "@/lib/utils";
import { config } from "@/wagmiConfig";
import { Address, WaitForTransactionReceiptReturnType, parseAbi } from "viem";
import { readContract, writeContract } from "@wagmi/core";
import { useState } from "react";

const REWARD_DISTRIBUTOR_ROLE =
  "0xb814ff4a26ea3ec5cd1fa579daad86324826254265f3acfec78303a19845b449";

export type RewardDistribution = {
  rewardTimestamp: number;
  token: Address;
  amount: bigint;
};

type UseAdminRewardsHook__Type = {
  addRewardDistribution: (
    rewardDistributions: RewardDistribution,
  ) => Promise<void>;
  addRewardDistributions: (
    rewardDistributions: RewardDistribution[],
  ) => Promise<void>;
  addingRewardDistribution: boolean;
  hasRewardDistributorRole: (address: Address) => Promise<boolean>;
};

const abi = parseAbi([
  "error RewardDistributor__NoTotalSupply(uint256 timestamp)",
  "struct RewardDistributionInfo { uint32 rewardTimestamp; address token; uint256 amount; }",
  "function addRewardDistribution(RewardDistributionInfo rewardDistribution) external",
  "function addRewardDistributions(RewardDistributionInfo[] rewardDistributions) external",
  "function hasRole(bytes32 role, address account) external view returns (bool)",
]);

export const useAdminRewards = ({
  rewardDistributorAddress,
  onPrompt,
  onSubmitted,
  onSuccess,
  onError,
}: {
  rewardDistributorAddress?: Address;
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
}): UseAdminRewardsHook__Type => {
  const [addingRewardDistribution, setAddingRewardDistribution] =
    useState(false);

  const addRewardDistribution = async (
    rewardDistribution: RewardDistribution,
  ) => {
    if (!rewardDistributorAddress) panic("No reward distributor address");

    await submitAction(
      async () => {
        return await writeContract(config, {
          address: rewardDistributorAddress!,
          abi,
          functionName: "addRewardDistribution",
          args: [rewardDistribution],
        });
      },
      {
        onPrompt: () => {
          setAddingRewardDistribution(true);
          if (onPrompt) onPrompt();
        },
        onSubmitted,
        onSuccess: async (receipt) => {
          setAddingRewardDistribution(false);
          if (onSuccess) onSuccess(receipt);
        },
        onError: (err) => {
          console.error(err);
          setAddingRewardDistribution(false);
          if (onError) onError(err);
        },
      },
    );
  };

  const addRewardDistributions = async (
    rewardDistributions: RewardDistribution[],
  ) => {
    if (!rewardDistributorAddress) panic("No reward distributor address");

    await submitAction(
      async () => {
        return await writeContract(config, {
          address: rewardDistributorAddress!,
          abi,
          functionName: "addRewardDistributions",
          args: [rewardDistributions],
        });
      },
      {
        onPrompt: () => {
          setAddingRewardDistribution(true);
          if (onPrompt) onPrompt();
        },
        onSubmitted,
        onSuccess: async (receipt) => {
          setAddingRewardDistribution(false);
          if (onSuccess) onSuccess(receipt);
        },
        onError: (err) => {
          console.error(err);
          setAddingRewardDistribution(false);
          if (onError) onError(err);
        },
      },
    );
  };

  const hasRewardDistributorRole = async (address: Address) => {
    if (!rewardDistributorAddress) panic("No reward distributor address");

    return await readContract(config, {
      address: rewardDistributorAddress!,
      abi,
      functionName: "hasRole",
      args: [REWARD_DISTRIBUTOR_ROLE, address],
    });
  };

  return {
    addRewardDistribution,
    addRewardDistributions,
    addingRewardDistribution,
    hasRewardDistributorRole,
  };
};
