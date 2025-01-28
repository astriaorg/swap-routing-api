import { Token } from '@uniswap/sdk-core';
import { ITokenProvider } from '../../providers/token-provider';
import { ChainId } from '../../util/chains';
declare type ChainTokenList = {
    readonly [chainId in ChainId]: Token[];
};
export declare const BASES_TO_CHECK_TRADES_AGAINST: (_tokenProvider: ITokenProvider) => ChainTokenList;
export declare const ADDITIONAL_BASES: (_tokenProvider: ITokenProvider) => Promise<{
    253368190?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    912559?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    16604737732183?: {
        [tokenAddress: string]: Token[];
    } | undefined;
}>;
/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export declare const CUSTOM_BASES: (_tokenProvider: ITokenProvider) => Promise<{
    253368190?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    912559?: {
        [tokenAddress: string]: Token[];
    } | undefined;
    16604737732183?: {
        [tokenAddress: string]: Token[];
    } | undefined;
}>;
export {};
