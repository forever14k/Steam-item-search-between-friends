class Steam
  
  magic: BigInteger '76561197960265728'

  toSteamId64: ( steamId32 ) ->
    @magic
      .add steamId32
      .toString()

  toSteamId32: ( steamId64 ) ->
    BigInteger steamId64
      .subtract @magic
      .toString()
