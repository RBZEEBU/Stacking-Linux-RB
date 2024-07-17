import { Address, Chain, WaitForTransactionReceiptReturnType } from "viem";
import { waitForTransactionReceipt } from "@wagmi/core";
import { config } from "@/wagmiConfig";
import { add, differenceInSeconds, nextThursday, startOfDay } from "date-fns";
import * as dn from "dnum";
import { UTCDate } from "@date-fns/utc";

const minInSeconds = 60;
const hourInSeconds = minInSeconds * 60;
const dayInSeconds = hourInSeconds * 24;

export const secondsInDays = (seconds: number) => seconds / dayInSeconds;

export const secondsInDate = (seconds: number): Date =>
  new Date(seconds * 1000);

type Callbacks__Type = {
  onPrompt?: () => void;
  onSubmitted?: (hash: `0x${string}`) => void;
  onSuccess?: (receipt: WaitForTransactionReceiptReturnType) => void;
  onError?: (err: unknown) => void;
};

export const submitAction = async (
  action: () => Promise<Address>,
  callbacks: Callbacks__Type,
) => {
  const { onPrompt, onSubmitted, onSuccess, onError } = callbacks;

  if (onPrompt) onPrompt();

  try {
    const hash = await action();
    if (onSubmitted) onSubmitted(hash);

    const receipt = await waitForTransactionReceipt(config, {
      hash,
    });

    if (onSuccess) onSuccess(receipt);
  } catch (err: any) {
    if (onError) onError(err);
    if ("message" in err) console.log(err.message);
    console.log(err);
  }
};

export const panic = <T>(e: unknown): T | never => {
  throw e;
};

export const getChainIconUrl = (chain: Chain) => {
  const { symbol } = chain.nativeCurrency;
  return `/${symbol.toLowerCase()}-logo.png`;
};

export const getUnlockTime = (date: Date, increaseInSeconds: number) => {
  // Now + seconds remaining until next thursday + seconds in {selected time period}
  let unlockTime = add(date, {
    seconds: differenceInSeconds(nextThursday(date), date) + increaseInSeconds,
  });

  return unlockTime;
};

export const formatBalance = (
  balance: bigint,
  decimals = 18,
  digits = 6,
  compact = false,
) => {
  return dn.format([balance, decimals], {
    digits,
    compact,
  });
};

export function formatBigInt(bigintValue: bigint, decimals: number): string {
  const factor = BigInt(10 ** decimals);
  const value = Number(bigintValue) / Number(factor);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
    useGrouping: false,
  }).format(value);
}

export function getNextEpoch(): Date {
  const nextEpoch = new Date(startOfDay(nextThursday(new UTCDate())));
  return nextEpoch;
}
