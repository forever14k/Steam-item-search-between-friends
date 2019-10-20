import { Big } from 'big.js';


const STEAM_MAGIC_NUMBER = new Big('76561197960265728');

export function toSteamId64(steamId32: string): string {
    return STEAM_MAGIC_NUMBER.plus(steamId32).toString();
}

export function toSteamId32(steamId64: string): string {
    return new Big(steamId64).minus(STEAM_MAGIC_NUMBER).toString();
}
