describe 'actions/steam', () ->

  describe '.toSteamId32()', () ->
    it 'it should convert from steamId64 to steamId32', () ->
      steamId32 = Steam::toSteamId32 '76561198004602330'
      expect( steamId32 ).toBe( '44336602' )

  describe '.toSteamId64()', () ->
    it 'it should convert from steamId32 to steamId64', () ->
      steamId64 = Steam::toSteamId64 '44336602'
      expect( steamId64 ).toBe( '76561198004602330' )
