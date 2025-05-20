import { ethers, BrowserProvider, JsonRpcProvider, Contract, formatUnits, toBigInt, Eip1193Provider, BigNumberish } from "ethers";
import NonfungiblePositionManagerAbi from "@/abis/NonfungiblePositionManager.json";
import ERC20Abi from "@/abis/ERC20.json";
import WBNBAbi from "@/abis/WBNB.json";
import SwapRouterAbi from "@/abis/SwapRouter.json";
import StakingFactoryAbi from "@/abis/StakingFactoryAbi.json";
import StakingPoolAbi from "@/abis/StakingPool.json";
import QuoterV2Abi from '@/abis/QuoterV2.json';
import SherexStakingAbi from '@/abis/SherexStaking.json'
// import { contractAddresses, SHRX_TOKEN, WETH_ADDRESS, TREASURY_ADDRESS, RPC_URL, STAKING_ADDRESS } from "@/utils/constants";
import { useAccount, useBalance, useBlock, useBlockNumber, useConfig, useReadContract, useSwitchChain, useToken, useWaitForTransactionReceipt, useWalletClient, useWriteContract } from 'wagmi';
import { contractAddresses, SHRX_TOKEN, WETH_ADDRESS, TREASURY_ADDRESS, RPC_URL, STAKING_ADDRESS } from "@/utils/constants";
import { readContract } from "viem/actions";
import { useEffect, useState } from "react";
import { wagmiConfig } from "../config/wagmi";
import { parseEther } from 'viem/utils';

export const useTokenContract = () => {
    const { writeContract, isSuccess: isApproved, error: approveError } = useWriteContract();

    const approve = async (address: string, spender: string, amount: BigNumberish) => {
        await writeContract({
            address: address as any,
            abi: ERC20Abi,
            functionName: 'approve',
            args: [spender, amount.toString()]
        });
    }

    return {
        approve,
        isApproved,
        approveError
    }
}

export const useBnbContract = () => {
    const { writeContract: callDeposit, isSuccess: isDeposited, error: depositError } = useWriteContract();
    const { writeContract: callWithdraw, isSuccess: isWithdrawn, error: withdrawError } = useWriteContract();

    const depositWBNB = async (amount: BigNumberish) => {
        await callDeposit({
            abi: WBNBAbi,
            address: WETH_ADDRESS,
            functionName: 'deposit',
            value: BigInt(amount.toString())
        });
    }

    const withdrawWBNB = async (amount: BigNumberish) => {
        await callWithdraw({
            abi: WBNBAbi,
            address: WETH_ADDRESS,
            functionName: 'withdraw',
            args: [amount]
        });
    }

    return {
        depositWBNB,
        withdrawWBNB,
        isDeposited,
        isWithdrawn,
        depositError,
        withdrawError
    }
}

export const useLiquidity = () => {
    const [data, setData] = useState<any>(null);
    const [stage, setStage] = useState<
        'none' | 'deposit0' | 'approve0' | 'deposit1' | 'approve1' | 'createlp' | 'mintlp'
    >('none');
    const { writeContract: createLP, isPending: isLpCreating, isSuccess: isLpCreated, error: lpCreateError } = useWriteContract();
    const { writeContract: mintLP, isPending: isMinting, isSuccess: isLpMinted, error: lpMintError } = useWriteContract();
    const { address: account } = useAccount();
    const { depositWBNB, isDeposited } = useBnbContract();
    const { approve: approveToken, isApproved } = useTokenContract();

    useEffect(() => {
        if (stage === 'deposit0') {
            depositWBNB(data.amount0);
        } else if (stage === 'approve0') {
            approveToken(data.token0, contractAddresses.nonfungiblePositionManager, data.amount0)
        } else if (stage === 'deposit1') {
            depositWBNB(data.amount1);
        } else if (stage === 'approve1') {
            approveToken(data.token1, contractAddresses.nonfungiblePositionManager, data.amount1);
        } else if (stage === 'createlp') {
            let tokenA = data.token0, tokenB = data.token1;

            if (data.token0 > data.token1) {
                tokenA = data.token1;
                tokenB = data.token0;
            }

            // create pool
            createLP({
                abi: NonfungiblePositionManagerAbi,
                address: contractAddresses.nonfungiblePositionManager as any,
                functionName: 'createAndInitializePoolIfNecessary',
                args: [
                    tokenA,
                    tokenB,
                    data.fee,
                    data.sqrtPriceX96.toString()
                ]
            });
        } else if (stage === 'mintlp') {
            const deadline = new Date().valueOf() + 1800; // 30 min
            let tokenA = data.token0, tokenB = data.token1;
            let amountA = data.amount0, amountB = data.amount1;

            if (data.token0 > data.token1) {
                tokenA = data.token1;
                tokenB = data.token0;

                amountA = data.amount1;
                amountB = data.amount0;
            }

            mintLP({
                abi: NonfungiblePositionManagerAbi,
                address: contractAddresses.nonfungiblePositionManager as any,
                functionName: 'mint',
                args: [
                    tokenA,          // token0
                    tokenB,          // token1
                    data.fee,            // fee
                    data.tickLower.toString(),      // tickLower
                    data.tickUpper.toString(),      // tickUpper
                    amountA,        // amount0Desired
                    amountB,        // amount1Desired
                    0,              // amount0Min
                    0,              // amount1Min
                    account,
                    deadline
                ]
            });
        } else {
            // do nothing.
        }
    }, [stage]);

    useEffect(() => {
        if (isDeposited && stage === 'deposit0') {
            setStage('approve0');
        } else if (isDeposited && stage === 'deposit1') {
            setStage('approve1');
        }
    }, [isDeposited, stage]);

    useEffect(() => {
        if (isApproved && stage === 'approve0') {
            if (data.token1.toLowerCase() == WETH_ADDRESS.toLowerCase() && data.isNative1) {
                setStage('deposit1');
            } else {
                setStage('approve1');
            }

        } else if (isApproved && stage === 'approve1') {
            setStage('createlp');
        }
    }, [isApproved, stage, data]);

    useEffect(() => {
        if (isLpCreated && stage === 'createlp') {
            setStage('mintlp');
        }
    }, [isLpCreated, stage]);

    const addLiquidity = (
        token0: string,
        token1: string,
        fee: BigNumberish,
        tickLower: BigNumberish,
        tickUpper: BigNumberish,
        amount0: BigNumberish,
        amount1: BigNumberish,
        sqrtPriceX96: BigNumberish,
        isNative0: boolean,
        isNative1: boolean
    ) => {
        setData({
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            amount0,
            amount1,
            sqrtPriceX96,
            isNative0,
            isNative1
        });

        if (token0.toLowerCase() == WETH_ADDRESS.toLowerCase() && isNative0) {
            setStage('deposit0');
        } else {
            setStage('approve0');
        }
    }

    return {
        addLiquidity,
        stage,
        isLoading: isLpCreating || isMinting,
        error: lpCreateError || lpMintError
    }
}

export const useStakingPool = (token: string) => {
    const { approve, isApproved } = useTokenContract();
    const { writeContract: callCreatePool, isSuccess: isPoolCreated, error: createPoolError } = useWriteContract();
    const [data, setData] = useState<any>(null);

    const createStakingPool = async (
        rewardAmount: BigNumberish,
        apys: number[],
        lockPeriods: number[]
    ) => {
        approve(token, contractAddresses.stakingFactory, rewardAmount);
        setData([
            token,
            rewardAmount,
            apys,
            lockPeriods,
            TREASURY_ADDRESS
        ]);
    }

    useEffect(() => {
        if (isApproved) {
            callCreatePool({
                abi: StakingFactoryAbi,
                address: contractAddresses.stakingFactory as any,
                functionName: 'createStakingPool',
                args: data
            });
        }
    }, [isApproved]);

    return {
        createStakingPool,
        isPoolCreated,
        createPoolError
    }
}

export const useStaking = (poolAddress: string, stakingToken: string) => {
    const { approve, isApproved } = useTokenContract();
    const { writeContract: callStake, isSuccess: isStaked, error: stakeError } = useWriteContract();
    const [data, setData] = useState<any>(null);

    const stake = async (
        amount: BigNumberish,
        apyIndex: number
    ) => {
        approve(stakingToken, poolAddress, amount);
        setData([
            amount,
            apyIndex
        ]);
    }

    useEffect(() => {
        if (isApproved) {
            callStake({
                abi: StakingPoolAbi,
                address: poolAddress as any,
                functionName: 'stake',
                args: data
            });
        }
    }, [isApproved]);

    return {
        stake,
        isStaked,
        stakeError
    }
}

export const useSherexStaking = (poolAddress: string, stakingToken: string) => {
    const { approve, isApproved } = useTokenContract();
    const { writeContract: callStake, isSuccess: isStaked, error: stakeError } = useWriteContract();
    const [data, setData] = useState<any>(null);

    const stakeSherex = async (
        amount: BigNumberish,
        lockPeriod: number
    ) => {
        approve(SHRX_TOKEN.address, STAKING_ADDRESS, amount);
        setData([
            amount,
            lockPeriod * 86400
        ]);
    }

    useEffect(() => {
        if (isApproved) {
            callStake({
                abi: SherexStakingAbi,
                address: STAKING_ADDRESS,
                functionName: 'stake',
                args: data
            });
        }
    }, [isApproved]);

    return {
        stakeSherex,
        isStaked,
        stakeError
    }
}

export function useQuote(
    tokenIn: string,
    tokenOut: string,
    feeTier: number,
    amountIn: BigNumberish,
    enabled = true
) {
    const { data, isLoading, error } = useReadContract({
        address: contractAddresses.quoterV2 as any,
        abi: QuoterV2Abi,
        functionName: 'quoteExactInputSingle',
        args: [
            {
                tokenIn,
                tokenOut,
                amountIn,
                fee: feeTier,
                sqrtPriceLimitX96: 0n, // must be BigInt or BN depending on setup
            },
        ],
        query: {
            enabled: enabled && !!tokenIn && !!tokenOut && !!amountIn && !!feeTier,
        },
    })
    return { amountOut: (data as any)?.amountOut, isLoading, error }
}

export function useRemainingStakingTokens() {
    const {
        data: remainRewards,
        isLoading: isLoadingRewards,
        error: rewardsError,
    } = useReadContract({
        address: STAKING_ADDRESS,
        abi: SherexStakingAbi,
        functionName: 'remainingStakingTokens',
    })

    const {
        data: totalStaked,
        isLoading: isLoadingStaked,
        error: stakedError,
    } = useReadContract({
        address: SHRX_TOKEN.address as any,
        abi: ERC20Abi,
        functionName: 'balanceOf',
        args: [STAKING_ADDRESS],
    })

    return {
        remainRewards: remainRewards as BigNumberish,
        totalStaked: totalStaked as BigNumberish,
        isLoading: isLoadingRewards || isLoadingStaked,
        error: rewardsError || stakedError,
    }
}

export function useSwap() {
    const [stage, setStage] = useState<"none" | "deposit" | "approve" | "swap">("none");
    const [data, setData] = useState<{
        tokenIn: string,
        tokenOut: string,
        feeTier: number,
        amountIn: BigNumberish
    } | null>(null);
    const { address, isConnected, chain, chainId } = useAccount()
    const { depositWBNB, isDeposited, depositError } = useBnbContract();
    const { approve: approveToken, isApproved } = useTokenContract();
    const { switchChain } = useSwitchChain()

    const { chains } = useConfig();
    console.log('Available chains:', chains);

    console.log("---chain---", chain, chainId)

    useEffect(() => {
        // force to switch to bsc network
        if (chainId != 56) {
            console.log('----switching----')
            switchChain({ chainId: 56 });
        }
    }, [chainId]);

    const {
        writeContract,
        data: txHash,
        isPending,
        isSuccess,
        error: writeError,
    } = useWriteContract()

    const swap = () => {
        if (!data) return;

        const deadline = Math.floor(Date.now() / 1000) + 60 * 30 // 30 minutes from now

        const params = [
            data.tokenIn,
            data.tokenOut,
            data.feeTier,
            address,
            deadline,
            data.amountIn,
            0n,
            0n,
        ];

        writeContract({
            abi: SwapRouterAbi,
            address: contractAddresses.swapRouter as any,
            functionName: 'exactInputSingle',
            args: [params],
        });
    }

    useEffect(() => {
        if (stage === 'deposit') {
            if (data?.amountIn) {
                depositWBNB(data.amountIn);
            }
        } else if (stage === 'approve') {
            if (data?.amountIn) {
                approveToken(data.tokenIn, contractAddresses?.swapRouter, data.amountIn)
            }
        } else if (stage === 'swap') {
            swap();
        } else {
            // do nothing.
        }
    }, [stage]);

    useEffect(() => {
        if (isDeposited && stage === 'deposit') {
            setStage('approve');
        }
    }, [isDeposited, stage]);

    useEffect(() => {
        if (isApproved && stage === 'approve') {
            setStage('swap');
        }
    }, [isApproved, stage]);

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: confirmError,
    } = useWaitForTransactionReceipt({
        hash: txHash,
    })

    console.log('----swapping-----', stage, data, isDeposited, isApproved, isPending, isConfirmed, depositError);

    const executeSwap = async (
        tokenIn: string,
        tokenOut: string,
        feeTier: number,
        amountIn: BigNumberish,
        isNative: boolean,
    ) => {
        if (!isConnected || !address) return;

        setData({
            tokenIn,
            tokenOut,
            feeTier,
            amountIn
        });

        if (tokenIn === WETH_ADDRESS?.toLowerCase() && isNative) {
            setStage('deposit');
        } else {
            setStage('approve');
        }
    }

    return {
        executeSwap,
        stage,
        isPending,
        isConfirmed,
        error: writeError || confirmError,
    }
}