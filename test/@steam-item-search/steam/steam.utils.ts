import { toSteamId32, toSteamId64, toSteamInventoryV1, getSteamInventoryV1DescriptionId }from '../../../source/@steam-item-search/steam/steam.utils'
import {
    SteamInventoryBaseAsset, SteamInventoryBaseDescription, SteamInventoryItemMarketable, SteamInventoryItemTradable
} from '../../../source/@steam-item-search/steam/inventory/steam-inventory';

describe('steam/steam.utils.ts', () => {

    describe('toSteamId32+', () => {

        it('it should convert from steamId64 to steamId32', () => {
            expect(toSteamId32('76561198004602330')).toBe('44336602');
        });

    });

    describe('toSteamId64', () => {

        it('it should convert from steamId32 to steamId64', () => {
            expect(toSteamId64('44336602')).toBe('76561198004602330');
        });

    });

    describe('toSteamInventoryV1', () => {});

    describe('getSteamInventoryV1DescriptionId', () => {

        it('it should return description id from SteamInventoryBaseAsset', () => {
            expect(
                getSteamInventoryV1DescriptionId({
                    assetid: "665167765",
                    classid: "170676678",
                    instanceid: "253068381",
                    amount: "1"
                } as SteamInventoryBaseAsset)
            )
            .toBe('170676678_253068381');
        });

        it('it should return description id from SteamInventoryBaseDescription', () => {
            expect(
                getSteamInventoryV1DescriptionId({
                    classid: "170676678",
                    instanceid: "253068381",

                    currency: 0, commodity: 0,
                    marketable: SteamInventoryItemMarketable.MARKETABLE, tradable: SteamInventoryItemTradable.NOT_TRADABLE,
                    name_color: '', background_color: '',
                    icon_url: '', icon_url_large: '',
                    type: '', name: '',
                    market_name: '', market_hash_name: '',
                    market_marketable_restriction: 0, market_tradable_restriction: 0,
                    actions: [], market_actions: [],
                    descriptions: [], tags: [],
                } as SteamInventoryBaseDescription)
            )
            .toBe('170676678_253068381');
        });

    });

});