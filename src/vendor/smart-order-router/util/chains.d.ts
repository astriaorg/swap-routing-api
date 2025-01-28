import { Ether, NativeCurrency, Token } from '@uniswap/sdk-core';
export declare enum ChainId {
    MAINNET = 253368190,
    FLAME_DEVNET = 912559,
    FLAME_TESTNET = 16604737732183
}
export declare const SUPPORTED_CHAINS: ChainId[];
export declare const V2_SUPPORTED: ChainId[];
export declare const HAS_L1_FEE: ChainId[];
export declare const ID_TO_CHAIN_ID: (id: number) => ChainId;
export declare enum ChainName {
    MAINNET = "flame",
    FLAME_DEVNET = "flame-devnet",
    FLAME_TESTNET = "flame-testnet"
}
export declare enum NativeCurrencyName {
    RIA = "RIA",
    TIA = "TIA"
}
export declare const NATIVE_NAMES_BY_ID: {
    [chainId: number]: string[];
};
export declare const NATIVE_CURRENCY: {
    [chainId: number]: NativeCurrencyName;
};
export declare const ID_TO_NETWORK_NAME: (id: number) => ChainName;
export declare const CHAIN_IDS_LIST: string[];
export declare const ID_TO_PROVIDER: (id: ChainId) => string;
export declare const WRAPPED_NATIVE_CURRENCY: {
    [chainId in ChainId]: Token;
};
export declare class ExtendedEther extends Ether {
    get wrapped(): Token;
    private static _cachedExtendedEther;
    static onChain(chainId: number): ExtendedEther;
}
export declare function nativeOnChain(chainId: number): NativeCurrency;
