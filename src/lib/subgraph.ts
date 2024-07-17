import { GraphQLClient, gql } from "graphql-request";
import { Address } from "viem";

export type RewardToken__Type = {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  totalRewardAmount: string;
  availableRewardAmount: string;
};

type RewardDistributor__Type = {
  id: string;
  rewardTokens: RewardToken__Type[];
};

type VotingEscrow__Type = {
  id: string;
  address: Address;
  name: string;
  symbol: string;
  lockedAmount: string;
  decimals: string;
  supplyVestedPercent: string;
  maxTime: string;
};

export type VeSystem__Type = {
  id: string;
  bptToken: Address;
  bptTokenName: string;
  bptTokenSymbol: string;
  votingEscrow: VotingEscrow__Type;
  rewardDistributor: RewardDistributor__Type;
  rewardDistributorAddress: Address;
  admin: Address;
  blockTimestamp: string;
};

export type Lock__Type = {
  id: string;
  votingEscrow: Address;
  totalLocked: string;
  lockStart: string;
  unlockTime: string;
};

export type Reward__Type = {
  id: string;
  token: string;
  rewardTimestamp: string;
  unclaimedAmount: string;
  totalAmount: string;
};

type GetRecentTransactionsByUserResponse__Type = {
  user: {
    locks: {
      id: string;
      timestamp: string;
      type: string;
      tx: string;
    }[];
    userRewardClaims: {
      claimTimestamp: string;
      token: string;
      id: string;
      txHash: string;
    }[];
    userTokenTotalClaims: {
      id: string;
      rewardsClaimed: string;
      token: string;
    }[];
  };
};

type GetVeSystemsResponse_Type = {
  vesystems: VeSystem__Type[];
};

type GetVeSystemResponse__Type = {
  vesystem: VeSystem__Type;
};

type GetRewardsResponse__Type = {
  rewardDistributions: Reward__Type[];
};

type GetLocksResponse__Type = {
  locks: Lock__Type[];
};

export class Subgraph {
  public client: GraphQLClient;

  constructor(uri: string) {
    this.client = new GraphQLClient(uri, { cache: "no-store" });
  }

  public async getRecentTransactionsByUser(id: Address, limit: number) {
    const query = gql`
      query GetRecentTransactionsByUser($id: String!, $limit: Int!) {
        user(id: $id) {
          locks(first: $limit, orderDirection: desc, orderBy: timestamp) {
            id
            timestamp
            type
            tx
          }
          userRewardClaims(
            first: $limit
            orderDirection: desc
            orderBy: claimTimestamp
          ) {
            claimTimestamp
            token
            id
            txHash
          }
        }
      }
    `;

    const { user } =
      await this.client.request<GetRecentTransactionsByUserResponse__Type>(
        query,
        {
          id,
          limit,
        },
      );

    return user;
  }

  public async getLocksByUserId(id: Address) {
    const query = gql`
      query GetLocksByUserId($id: String!) {
        locks(
          where: { user_: { id: $id } }
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          votingEscrow
          totalLocked
          lockStart
          unlockTime
        }
      }
    `;

    const { locks } = await this.client.request<GetLocksResponse__Type>(query, {
      id,
    });

    return locks;
  }

  public async getAllVeSystems(contracts: string[]): Promise<VeSystem__Type[]> {
    contracts = contracts.map((contract) => contract.toLowerCase());

    const query = gql`
      query GetAllVeSystems($contracts: [String]!) {
        vesystems(
          orderBy: blockTimestamp
          orderBy: desc
          where: { votingEscrowAddress_in: $contracts }
        ) {
          id
          bptToken
          bptTokenName
          bptTokenSymbol
          admin
          votingEscrow {
            id
            address
            name
            symbol
            lockedAmount
            supplyVestedPercent
            decimals
            maxTime
          }
          rewardDistributorAddress
          rewardDistributor {
            id
            rewardTokens(where: { availableRewardAmount_gt: 0 }) {
              id
              name
              address
              symbol
              decimals
              totalRewardAmount
              availableRewardAmount
            }
          }
          blockTimestamp
        }
      }
    `;

    const { vesystems } = await this.client.request<GetVeSystemsResponse_Type>(
      query,
      {
        contracts,
      },
    );

    return vesystems;
  }

  public async getVeSystems(ids: string[]): Promise<VeSystem__Type[]> {
    const query = gql`
      query GetVeSystems($ids: [String]!) {
        vesystems(where: { id_in: $ids }) {
          id
          bptToken
          bptTokenName
          bptTokenSymbol
          votingEscrow {
            id
            address
            name
            symbol
            lockedAmount
            supplyVestedPercent
            decimals
          }
          rewardDistributorAddress
          rewardDistributor {
            id
            rewardTokens(where: { availableRewardAmount_gt: 0 }) {
              id
              name
              address
              symbol
              decimals
              totalRewardAmount
              availableRewardAmount
            }
          }
        }
      }
    `;

    const { vesystems } = await this.client.request<GetVeSystemsResponse_Type>(
      query,
      {
        ids,
      },
    );

    return vesystems;
  }

  public async getVeSystem(id: string): Promise<VeSystem__Type> {
    const query = gql`
      query GetVeSystem($id: String!) {
        vesystem(id: $id) {
          id
          bptToken
          bptTokenName
          bptTokenSymbol
          admin
          votingEscrow {
            id
            address
            name
            symbol
            lockedAmount
            supplyVestedPercent
            decimals
            maxTime
          }
          rewardDistributorAddress
          rewardDistributor {
            id
            rewardTokens(where: { availableRewardAmount_gt: 0 }) {
              id
              name
              address
              symbol
              decimals
              totalRewardAmount
              availableRewardAmount
            }
          }
          blockTimestamp
        }
      }
    `;

    const { vesystem } = await this.client.request<GetVeSystemResponse__Type>(
      query,
      {
        id,
      },
    );

    return vesystem;
  }

  public async getRewardsByVeSystemId({
    id,
    timestamp,
  }: {
    id: string;
    timestamp: string;
  }): Promise<Reward__Type[]> {
    const query = gql`
      query GetRewardsByVeSystemId($id: String!, $timestamp: String!) {
        rewardDistributions(
          where: {
            rewardDistributor_: { vesystem: $id }
            rewardTimestamp_lte: $timestamp
            unclaimedAmount_gt: 0
          }
          orderBy: rewardTimestamp
          orderDirection: desc
        ) {
          id
          token
          unclaimedAmount
          totalAmount
          rewardTimestamp
        }
      }
    `;

    const { rewardDistributions } =
      await this.client.request<GetRewardsResponse__Type>(query, {
        id,
        timestamp,
      });

    return rewardDistributions;
  }
}
