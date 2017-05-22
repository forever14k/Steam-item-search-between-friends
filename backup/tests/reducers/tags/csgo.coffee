describe 'reducers/tags/csgo', () ->
  describe '.tagCSGODescStickers()', () ->
    it 'it should detect stickers', () ->
      description = __mock__( 'tags/csgo/description/stickers/4')

      TagsCSGOReducer::tagCSGODescStickers description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_STICKER
        name: 'byali (Gold) | Cologne 2015'
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_STICKER
        name: 'Fnatic (Gold) | Cologne 2015'
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_STICKER
        name: 'Virtus.Pro (Gold) | Cologne 2015'
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_STICKER
        name: 'ESL (Gold) | Cologne 2015'
