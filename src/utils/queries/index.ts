import { gql } from '@apollo/client';

export const GET_TOKENS = gql`
  query GetTokens {
    tokens {
      id
      name
      symbol
      decimals
      volume
      totalValueLocked
      txCount
      derivedETH
      whitelistPools {
        id
        token0 {
          id
        }
        token1 {
          id
        }
        token0Price
        token1Price
      }
    }
  }
    
`;
export const GET_POOLS = gql`
  query GET_POOLS {
    pools {
      id
      totalValueLockedToken0
      totalValueLockedToken1
      volumeToken0
      volumeToken1
      token0Price
      token1Price
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      feeTier
      collectedFeesToken0
      collectedFeesToken1
    }
  }
    
`;

export const GET_STAKING_POOLS = gql`
  query GET_STAKING_POOLS {
    stakingPools {
      id
      poolAddress
      stakingToken
      rewardToken
      apys
      lockPeriods
      totalStaked
      totalRewardAmount
      remainingRewards
    }
  }
`;

export const GET_MASTERCHEF = gql`
  query GET_MASTERCHEF {
    masterChefs {
      id
      totalAllocPoint
      undistributedCake
      lastHarvestBlock
      latestPeriodStartTime
      latestPeriodEndTime
      latestPeriodCakePerSecond
      latestPeriodCakeAmount
      periodDuration
      poolCount
    }
    pools {
      v3Pool
      allocPoint
      totalUsersCount
      userCount
    }
    userPositions {
      id
      pool {
        v3Pool
      }
      liquidity
      earned
      isStaked
      user {
        address
      }
    }
  }
`

export const GET_SWAPS = gql`
  query GET_SWAPS($timestamp: BigInt!) {
    swaps(where: { timestamp_gte: $timestamp } orderBy: timestamp orderDirection: asc) {
      pool {
        id
        feeTier
      }
      poolToken0Locked
      poolToken1Locked
      timestamp
      token0 {
        id
        decimals
        symbol
      }
      totalValueLockedToken0
      totalValueLockedToken1
      token1 {
        id
        decimals
        symbol
      }
    }
  }
`;

export const GET_BUNDLES = gql`
  query GET_BUNDLES {
    bundles {
      ethPriceUSD
    }
  }
`