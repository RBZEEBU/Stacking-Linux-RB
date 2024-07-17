import { useState } from "react";
import { writeContract } from "@wagmi/core";
import { Address, WaitForTransactionReceiptReturnType, parseAbi } from "viem";
import { config } from "@/wagmiConfig";
import { submitAction } from "@/lib/utils";

type UseStakeHook__Type = {
  stake: (value: bigint, unlockTime: bigint) => Promise<void>;
  increasePeriod: (unlockTime: bigint) => Promise<void>;
  increaseAmount: (value: bigint) => Promise<void>;
  loading: boolean;
};

const abi = parseAbi([
  "function create_lock(uint256 _value, uint256 _unlock_time) external",
  "function increase_amount(uint256 _amount) external",
  "function increase_unlock_time(uint256 _unlock_time) external",
]);

export const useStake = ({
  address,
  amount,
  onPrompt,
  onSubmitted,
  onSuccess,
  onError,
}: {
  address: Address;
  amount: bigint;
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
}): UseStakeHook__Type => {
  const [loading, setLoading] = useState<boolean>(false);

  const createLock = async (value: bigint, unlockTime: bigint) => {
    await submitAction(
      async () => {
        return await writeContract(config, {
          address,
          abi,
          functionName: "create_lock",
          args: [value, unlockTime],
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

  const increaseAmount = async (value: bigint) => {
    await submitAction(
      async () => {
        return await writeContract(config, {
          address,
          abi,
          functionName: "increase_amount",
          args: [value],
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

  const increasePeriod = async (unlockTime: bigint) => {
    await submitAction(
      async () => {
        return await writeContract(config, {
          address,
          abi,
          functionName: "increase_unlock_time",
          args: [unlockTime],
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

  const stake = async (value: bigint, unlockTime: bigint) => {
    if (amount === BigInt(0)) {
      await createLock(value, unlockTime);
      return;
    }

    await increaseAmount(value);
  };

  return {
    stake,
    loading,
    increasePeriod,
    increaseAmount,
  };
};
