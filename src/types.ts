import { Address } from "viem";
import { RewardToken__Type } from "./lib/subgraph";

export type Pool_Reward__Type = {
  token: string;
  apr: number;
};

export type Pool__Type = {
  id: string;
  address: Address;
  token: string;
  tokenAddress: Address;
  tokenSymbol: string;
  name: string;
  symbol: string;
  decimals: string;
  yourStake: string;
  stake: string;
  start: number;
  end: number;
  duration: number;
  apy: number;
  staking: boolean;
  rewardTokens: RewardToken__Type[];
  rewardDistributorAddress: Address;
  timestamp: number;
  admin: Address;
  maxLockTime: number;
};

export type Recent_Transaction = {
  id: string;
  timestamp: number;
  type: Recent_Transaction_Enum;
  tx: string;
  token?: string;
  lockType?: string;
};

export enum Recent_Transaction_Enum {
  LOCK = "lock",
  REWARD_CLAIM = "reward_claim",
}

export enum Alert_Kind__Enum_Type {
  PROGRESS = "progress",
  INFO = "info",
  SUCCESS = "success",
  ERROR = "error",
}

export type Alert__Type = {
  kind: Alert_Kind__Enum_Type;
  message: string;
};
