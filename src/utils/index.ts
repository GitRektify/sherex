import { toBigInt } from "ethers";
import BigNumber from 'bignumber.js';
import { staticTokens } from "@/utils/constants";
import TokenList from '@/assets/tokenlist.json';
// import ETH  from "@/assets/image/ETH.png";


export const formatAddress = (address) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 5, address.length)}` : '';
}

// PancakeSwap V3 Constants
export const FEE_TIERS = {
  LOWEST: 100,   // 0.01%
  LOW: 500,      // 0.05%
  MEDIUM: 2500,  // 0.25%
  HIGH: 10000    // 1.00%
};

export const TICK_SPACINGS = {
  [FEE_TIERS.LOWEST]: 1,
  [FEE_TIERS.LOW]: 10,
  [FEE_TIERS.MEDIUM]: 50,
  [FEE_TIERS.HIGH]: 200
};

const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds

const timeRanges = {
  "24h": now - 86400,       // 24 hours ago
  "1w": now - 604800,       // 1 week ago
  "1m": now - 2592000,      // 1 month ago (30 days)
  "1y": now - 31536000      // 1 year ago
};

export const PRECSION = new BigNumber(10).pow(12);

// Uniswap V3 Math Functions
export function adjustPriceForDecimals(price, decimalsToken0, decimalsToken1) {
  const decimalDifference = decimalsToken0 - decimalsToken1;
  return price * 10 ** decimalDifference;
}

export function getSqrtPriceX96(price, tokenA, tokenB) {
  // Convert to BigNumber and adjust for decimals
  const [token0, token1] = tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];

  ////console.log('Initial price:', price);
  let adjustedPrice = new BigNumber(price.toString());
  adjustedPrice = adjustedPrice.multipliedBy(new BigNumber(10).pow(token1.decimals - token0.decimals));
  ////console.log('As BigNumber:', adjustedPrice?.toFixed()); // Use toFixed() to show full decimal


  // Calculate sqrt using BigNumber
  const Q96 = new BigNumber(2).pow(96);
  const sqrtPrice = adjustedPrice.sqrt();

  // Convert to proper format for contract
  const sqrtPriceX96 = sqrtPrice.multipliedBy(Q96).integerValue(BigNumber.ROUND_DOWN);
  ////console.log('Final sqrtPriceX96:', sqrtPriceX96?.toFixed()); // Use toFixed() to show full decimal

  return toBigInt(sqrtPriceX96?.toFixed()); // Use toFixed() to convert to full decimal string
}

export function getTickFromPrice(price) {
  return Math.floor(Math.log(price) / Math.log(1.0001));
}

export function getPriceFromTick(tick) {
  return Math.pow(1.0001, tick);
}

// Add helper function for tick range validation
export function validateTickRange(tickLower, tickUpper) {
  const MIN_TICK = -887272;
  const MAX_TICK = 887272;

  return {
    tickLower: Math.max(MIN_TICK, tickLower),
    tickUpper: Math.min(MAX_TICK, tickUpper)
  };
}

// Update getTickBounds to include validation
export function getTickBounds(bMinPrice, bMaxPrice, tickSpacing) {
  const minPrice = Number(bMinPrice.toString());
  const maxPrice = Number(bMaxPrice.toString());
  ////console.log('minPrice:', minPrice);
  ////console.log('maxPrice:', maxPrice);

  let tickLower = Math.floor(Math.log(minPrice) / Math.log(1.0001));
  let tickUpper = Math.floor(Math.log(maxPrice) / Math.log(1.0001));

  // Round to valid tick spacing
  tickLower = Math.floor(tickLower / tickSpacing) * tickSpacing;
  tickUpper = Math.floor(tickUpper / tickSpacing) * tickSpacing;
  ////console.log('tickLower:', Math.floor(tickLower / tickSpacing));
  ////console.log('tickUpper:', Math.floor(tickUpper / tickSpacing));
  ////console.log('tickLower:', tickLower);
  ////console.log('tickUpper:', tickUpper);

  // Validate tick range
  const { tickLower: validLower, tickUpper: validUpper } = validateTickRange(tickLower, tickUpper);

  return {
    tickLower: validLower,
    tickUpper: validUpper
  };
}

export function calculatePriceLimit(currentPrice, slippagePercent, isExactInput) {
  const slippageFactor = 1 + (slippagePercent / 100) * (isExactInput ? -1 : 1);
  return currentPrice * slippageFactor;
}

export function getTokenLogo(address) {
  const filteredTokens = staticTokens.filter((token) => token.address === address);

  const tokens = TokenList.tokens;
  if (!filteredTokens.length) {
    const listedTokens = tokens.filter((token) => token.address.toLowerCase() === address);
    if (!listedTokens.length) {
      return 'https://app.sherex.io/static/images/icons/ETH.png';
    } else {
      return listedTokens[0].logoURI ? listedTokens[0].logoURI : 'https://app.sherex.io/static/images/icons/ETH.png';
    }
  }
  else {
    return filteredTokens[0].logo ? filteredTokens[0].logo : 'https://app.sherex.io/static/images/icons/ETH.png';
  }
}

export function filterSwapsByTime(swaps, timeframe) {
  const startTime = timeRanges[timeframe]

  return swaps.filter(swap => parseInt(swap.timestamp) >= startTime);
}

export function sampleData(swaps, numSamples) {
  if (swaps.length <= numSamples) return swaps;

  const step = Math.floor(swaps.length / numSamples);

  return swaps.filter((_, index) => index % step === 0).slice(0, numSamples);
}

export function getMasterChefPoolInfo(masterChefPools, poolId) {
  const pools = masterChefPools.filter((pool) => pool.v3Pool === poolId.toLowerCase());

  if (pools.length > 0) {
    return pools[0];
  } else {
    return null;
  }
}

export function calculateApr(pool, masterChef, masterChefPools, sherexToken) {
  const masterChefPool = getMasterChefPoolInfo(masterChefPools, pool.id);
  const allocPoint = masterChefPool.allocPoint;
  const totalAllocPoint = masterChef.totalAllocPoint;
  const latestPeriodCakePerSecond = masterChef.latestPeriodCakePerSecond / PRECSION / new BigNumber(10).pow(18);
  const duration = masterChef.latestPeriodEndTime - masterChef.latestPeriodStartTime;
  const sherexPrice = sherexToken.price ? sherexToken.price : 0.00126;
  const poolTVL = pool.liquidity;

  const annualRewards = (allocPoint / totalAllocPoint) * latestPeriodCakePerSecond * duration;
  const annualRewardsUSD = annualRewards * sherexPrice;

  const apr = poolTVL ? annualRewardsUSD / poolTVL * 100 : 0;
  return apr;
}