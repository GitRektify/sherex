import { BigNumberish, formatUnits } from "ethers";
import ERC20Abi from "@/abis/ERC20.json";
import { getBalance, readContract } from "@wagmi/core";
import { wagmiConfig } from "../config/wagmi";
import { contractAddresses } from "./constants";
import QuoterV2Abi from '@/abis/QuoterV2.json';

export const getDecimals = async (address: string) => {
    const result = await readContract(wagmiConfig, {
        address: address as any,
        abi: ERC20Abi,
        functionName: 'decimals',
    });

    return result as any;
}

export const getSymbol = async (address: string) => {
    const result = await readContract(wagmiConfig, {
        address: address as any,
        abi: ERC20Abi,
        functionName: 'symbol',
    });

    return result;
}

export const getName = async (address: string) => {
    const result = await readContract(wagmiConfig, {
        address: address as any,
        abi: ERC20Abi,
        functionName: 'name',
    });

    return result;
}

export const getTokenBalance = async (address: string, account: string) => {
    const result = await readContract(wagmiConfig, {
        address: address as any,
        abi: ERC20Abi,
        functionName: 'balanceOf',
        args: [account]
    });

    const formattedBalance = formatUnits(result as any);
    return formattedBalance;
}

export const getNativeBalance = async (account: string) => {
    const balance = await getBalance(wagmiConfig, {
        address: account as any
    });
    return formatUnits(balance.value, balance.decimals);
}

export const quote = async (
    tokenIn: string,
    tokenOut: string,
    feeTier: number,
    amountIn: BigNumberish
) => {
    const result = await readContract(wagmiConfig, {
        address: contractAddresses.quoterV2 as any,
        abi: QuoterV2Abi,
        functionName: 'quoteExactInputSingle',
        args: [
            tokenIn,
            tokenOut,
            amountIn,
            feeTier,
            0n
        ]
    });

    return (result as any)?.amountOut as any;
}