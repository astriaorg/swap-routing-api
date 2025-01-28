import { Token } from '@uniswap/sdk-core';
import { ChainId } from './chains';
export declare const V3_CORE_FACTORY_ADDRESSES: AddressMap;
export declare const QUOTER_V2_ADDRESSES: AddressMap;
export declare const MIXED_ROUTE_QUOTER_V1_ADDRESSES: AddressMap;
export declare const UNISWAP_MULTICALL_ADDRESSES: AddressMap;
export declare const OVM_GASPRICE_ADDRESS = "0x420000000000000000000000000000000000000F";
export declare const ARB_GASINFO_ADDRESS = "0x000000000000000000000000000000000000006C";
export declare const TICK_LENS_ADDRESS = "0x8d9a1428683a003F1686e47640D721293a27432d";
export declare const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = "0x1dAfd262A228571125f36f1a1333389dB0444edA";
export declare const SWAP_ROUTER_ADDRESS = "0x29bBaFf21695fA41e446c4f37c07C699d9f08021";
export declare const V3_MIGRATOR_ADDRESS = "0x65F23e6C7eAdd8824f944773c4BED3016d5E24FC";
export declare const MULTICALL2_ADDRESS = "0x86AceBA84efCb6cd03939186A598141a33260436";
export declare type AddressMap = {
    [chainId: number]: string;
};
export declare const WETH9: {
    [chainId in ChainId]: Token;
};
