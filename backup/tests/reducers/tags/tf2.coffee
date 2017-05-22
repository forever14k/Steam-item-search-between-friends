describe 'reducers/tags/tf2', () ->
  describe '.tagTF2TypeLevel()', () ->
    it 'it should determine item level', () ->
      description = __mock__( 'tags/tf2/type/level/14' )

      TagsTF2Reducer::tagTF2TypeLevel description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_LEVEL
        name: '14'

  describe '.tagTF2TypeLimited()', () ->
    it 'it should determine item limited quality', () ->
      description = __mock__( 'tags/tf2/type/limited/44' )

      TagsTF2Reducer::tagTF2TypeLimited description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_QUALITY
        name: CHOICE_LIMITED

    it 'it should inherit .name_color if present', () ->
      description = __mock__( 'tags/tf2/type/limited/name_color/7D6D00' )

      TagsTF2Reducer::tagTF2TypeLimited description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_QUALITY
        name: CHOICE_LIMITED
        color: '7D6D00'

  describe '.tagTF2TypeStrange()', () ->
    it 'it should determine is item tracking anything', () ->
      description = __mock__( 'tags/tf2/type/strange/sentry kills' )

      TagsTF2Reducer::tagTF2TypeStrange description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TRACK
        name: 'Sentry kills'

  describe '.tagTF2DescStrangeKills()', () ->
    it 'it should determine is item tracking kills', () ->
      description = __mock__( 'tags/tf2/description/strange/kills' )

      TagsTF2Reducer::tagTF2DescStrangeKills description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TRACK
        name: 'Kills'

  describe '.tagTF2DescStrange()', () ->
    it 'it should detect item trackers', () ->
      description = __mock__( 'tags/tf2/description/strange/headshot kills' )

      TagsTF2Reducer::tagTF2DescStrange description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TRACK
        name: 'Headshot kills'

  describe '.tagTF2DescPaint()', () ->
    it 'it should detect item paint color', () ->
      description = __mock__( 'tags/tf2/description/paint/an extraordinary abundance of tinge' )

      TagsTF2Reducer::tagTF2DescPaint description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PAINT
        name: 'An extraordinary abundance of tinge'

  describe '.tagTF2DescHalloween()', () ->
    it 'it should detect halloween spell item', () ->
      description = __mock__( 'tags/tf2/description/halloween/bruised purple footprints' )

      TagsTF2Reducer::tagTF2DescHalloween description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HALLOWEEN
        name: 'Bruised purple footprints'

  describe '.tagTF2DescHoliday()', () ->
    it 'it should detect holiday restricted items', () ->
      description = __mock__( 'tags/tf2/description/holiday/tf birthday' )

      TagsTF2Reducer::tagTF2DescHoliday description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HOLIDAY
        name: 'TF Birthday'

  describe '.tagTF2DescEffectKillstreaker()', () ->
    it 'it should detect killstreaker effect', () ->
      description = __mock__( 'tags/tf2/description/effect/killstreaker/singularity' )

      TagsTF2Reducer::tagTF2DescEffectKillstreaker description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_EFFECT
        name: 'Singularity'

  describe '.tagTF2DescEffectSheen()', () ->
    it 'it should detect sheen effect', () ->
      description = __mock__( 'tags/tf2/description/effect/sheen/manndarin' )

      TagsTF2Reducer::tagTF2DescEffectSheen description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_EFFECT
        name: 'Manndarin'

  describe '.tagTF2DescEffectUnusual()', () ->
    it 'it should detect unusual effect', () ->
      description = __mock__( 'tags/tf2/description/effect/unusual/searing plasma' )

      TagsTF2Reducer::tagTF2DescEffectUnusual description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_EFFECT
        name: 'Searing plasma'

  describe '.tagTF2DescMedal()', () ->
    it 'it should detect medal number', () ->
      description = __mock__( 'tags/tf2/description/medal/7534' )

      TagsTF2Reducer::tagTF2DescMedal description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_MEDAL
        name: '7534'
