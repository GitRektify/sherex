// export const contractAddresses = {
//     pancakeV3PoolDeployer: "0x99D791abecE31E57d5eA39E17C1f983BfA51c074",
//     pancakeV3Factory: "0xc385F098289D6c0Df218D8f80eA65E6385737790",
//     swapRouter: "0xd1110BD9A2dC9135E94E132e3fb8279bbe10E10D",
//     nonfungiblePositionManager: "0xd5C0A7fAcd1DB50C4b6ea493ed4d45688aC8B213",
//     nonfungiblePositionDescriptor: "0x3f8ECE070d6f402C006b70e9b2dE102cE09C5eD4",
//     pancakeInterfaceMulticall: "0xd02456c09d10e448551aF6e115e913168F5b95bf",
//     v3Migrator: "0x8f46BfaEbD955AF8637fD0Fd8AE0D3aF16F40F95",
//     tickLens: "0x3087C3e522A03B804C648fe6ED3CCD2891998104",
//     quoterV2: "0xBA82EEDB3621c0F3df97dBB2C67f6E042A752DCd",
//     smartRouterHelper: "0x15F9ec4170aF15326b5CA5C19ae34F6fb3982d44",
//     smartRouter: "0x6344488AF3F7e0B738a17742647573ac113673F4",
//     mixedRouterQuoterV1: "0xB2c481fdB09Be6a3F855351E6BDFec584B00EDd4",
//     tokenValidator: "0x9fD539aC1909822FA4f5bCD4B5317D2D8B8acaDB",
//     masterChefV3: "0x61F4Cb659a23934F7f4c9fff9609f149e09cAC57",
//     pancakeV3LmPoolDeployer: "0xC2Ac55d8636BAdA29a44da92EceCf272eD6832FE",
//     stakingFactory: "0x6021Aca9154771ffe8E5d60B4f67bB0272A13384"
// }

import { ZeroAddress } from "ethers";

export const contractAddresses = {
    pancakeV3PoolDeployer: "0xDa88C0fe5be44A6EEEA02ddBdb1240422E4fde4C",
    pancakeV3Factory: "0xa8A87d42cA78CE39AdAEF27385f7f8d6d53341c1",
    swapRouter: "0x3E6DD78C4B56532625E35Bc47b18B7Be33ec3176",
    nonfungiblePositionManager: "0x6154dAC46B199b0e68162C4650D8c44d06ea43EF",
    nonfungiblePositionDescriptor: "0xE0C9c0573a6e7bD17084C65A21e907EF64F83217",
    pancakeInterfaceMulticall: "0x4a43C27999fB7e767CCB316f15998481cD8209Dc",
    v3Migrator: "0xc517eD43bA0d4c8A91F566b92537EA1aad746ecC",
    tickLens: "0x240E50603dB66fc2c977224AdC86FD31C526C60f",
    quoterV2: "0x8593A79328e532c0c67d08eEB4A6E8aCDE7ED5AF",
    smartRouterHelper: "0xC46BF95Dd951827750645FE87F9A25e992eD1737",
    smartRouter: "0x2727e1937E41FD4F945C708De262eE92066934C6",
    mixedRouterQuoterV1: "0x5d8760d422Ff93643592c01BaeE9390278D499B3",
    tokenValidator: "0x5059CC6D761C38C97764B5728f60Aa1439e9D870",
    masterChefV3: "0x34dcd6B6bADc5Ae8737F0Fb87988E80f1e2bC613",
    pancakeV3LmPoolDeployer: "0x93cF1DD9d1F9900b8aAbAffcBFA31B6A833655b8",
    stakingFactory: "0xA57E762b3f041F72Bf030d5aC374fc9F835D3791"
}

// export const GraphQL_URL = "https://api.studio.thegraph.com/query/102504/sherex-subgraph/version/latest";
// export const STAKING_GRAPHQL_URL = "https://api.studio.thegraph.com/query/102504/sherex-staking-subgraph/version/latest";

export const GraphQL_URL = "https://api.studio.thegraph.com/query/102504/sherex-subgraph-mainnet/version/latest";
export const STAKING_GRAPHQL_URL = "https://api.studio.thegraph.com/query/102504/sherex-staking-subgraph-mainnet/version/latest";
export const MasterChefV3_GRAPHQL_URL = "https://api.studio.thegraph.com/query/102504/sherex-masterchefv3-subgraph-mainnet/version/latest";


// export const WETH_ADDRESS = "0x48Dc8FbE4cd138aa0784D8b337e8955BFa061BbA";
// export const USDC_ADDRESS = "0x61f78d62152146de252474dcf5832b96048284e3";
// export const TREASURY_ADDRESS = "0x0365858333180C91a55C26D16acd04EB2dd58544";

export const WETH_ADDRESS = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
export const USDC_ADDRESS = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d";
export const TREASURY_ADDRESS = "0xd515fe129d613992167e4b04f5ae70f0a3bc440d";
export const STAKING_ADDRESS = "0x26e5d0f0c33D1680fd479853B9cfe8Bdb0110c2d"

export const RPC_URL = 'https://bsc-dataseed.bnbchain.org';

export const SHRX_STAKING_TOTAL = 2100000000;
export const SHRX_TOKEN = {
    address: "0x2409a6895a9e2199c379de8da426f0683b4064b9",
    name: "Sherex",
    symbol: "SHRX",
    decimals: 18,
};

export const testStakingPools = [
    "0x2698ebcc3a523972c0f5c5ebb980e20bd41c4c9a",
    "0x19f40b50677f421d821a22cd8cb3604a6b00ebaa"
]

export const staticTokens = [
    {
        address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        name: "BNB",
        symbol: "BNB",
        isNative: true,
        decimals: 18,
        logo: 'https://bscscan.com/token/images/bnbchain2_32.png'
    },
    {
        address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
        name: "Wrapped BNB",
        symbol: "WBNB",
        isNative: false,
        decimals: 18,
        logo: 'https://bscscan.com/token/images/bnbchain2_32.png'
    },
    {
        address: "0x55d398326f99059ff775485246999027b3197955",
        name: "Tether USD",
        symbol: "USDT",
        decimals: 18,
        logo: 'https://bscscan.com/token/images/busdt_32.png'
    },
    {
        address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 18,
        logo: 'https://bscscan.com/token/images/centre-usdc_28.png'
    },
    {
        address: "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
        name: "Binance-Peg Dai Token",
        symbol: "DAI",
        decimals: 18,
        logo: 'https://bscscan.com/token/images/dai_32.png'
    },
    {
        address: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
        name: "Pancake Token",
        symbol: "Cake",
        decimals: 18,
        logo: 'https://bscscan.com/token/images/pancake_32.png?v=2'
    },
    {
        address: "0x2409a6895a9e2199c379de8da426f0683b4064b9",
        name: "Sherex",
        symbol: "SHRX",
        decimals: 18,
        logo: "/sherex.png"
    }
]