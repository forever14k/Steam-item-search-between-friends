import { toSteamId32, toSteamId64 } from './steam-id';


describe('steam-id', () => {

    describe('toSteamId32', () => {

        it('it should convert from steamId64 to steamId32', () => {
            expect(toSteamId32('76561198004602330')).toBe('44336602');
        });

    });

    describe('toSteamId64', () => {

        it('it should convert from steamId32 to steamId64', () => {
            expect(toSteamId64('44336602')).toBe('76561198004602330');
        });

    });

});
