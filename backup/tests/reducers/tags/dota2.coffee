describe 'reducers/tags/dota2', () ->
  describe '.tagDOTA2DescEvent()', () ->
    it 'it should detect major dota events item', () ->
      description = __mock__( 'tags/dota2/description/event/the international 2013' )

      TagsDOTA2Reducer::tagDOTA2DescEvent description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_EVENT
        name: 'The International 2013'

  describe '.tagDOTA2DescHeroicVictory()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/victory' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicVictory @description

    afterEach () ->
      @description = null

    it 'it should detect heroic victory item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_VICTORY

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Unknown Team'

  describe '.tagDOTA2DescHeroicFirstBlood()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/first blood' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicFirstBlood @description

    afterEach () ->
      @description = null

    it 'it should detect heroic first blood item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_FIRSTBLOOD

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Invictus Gaming'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'WWW of RaTtLeSnAkE. CN GaMiNg'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'biubiubiu!'

  describe '.tagDOTA2DescHeroicDoubleKill()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/double kill' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicDoubleKill @description

    afterEach () ->
      @description = null

    it 'it should detect heroic double kill item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_DOUBLEKILL

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'BBUBU+4'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Combos Nich\'s'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Lexbreaker'

  describe '.tagDOTA2DescHeroicTripleKill()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/triple kill' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicTripleKill @description

    afterEach () ->
      @description = null

    it 'it should detect heroic triple kill item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_TRIPLEKILL

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Unknown Team'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'queens'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Rizza'

  describe '.tagDOTA2DescHeroicUltraKill()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/ultra kill' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicUltraKill @description

    afterEach () ->
      @description = null

    it 'it should detect heroic ultra kill item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_ULTRAKILL

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Suck My Dagon'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: '[rewind]'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Ardi'

  describe '.tagDOTA2DescHeroicRampage()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/rampage' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicRampage @description

    afterEach () ->
      @description = null

    it 'it should detect heroic rampage item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_RAMPAGE

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Unknown Team'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'SeriousModeOn'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Chur'

  describe '.tagDOTA2DescHeroicGodlike()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/godlike' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicGodlike @description

    afterEach () ->
      @description = null

    it 'it should detect heroic godlike item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_GODLIKE

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Duck &amp; Cover'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: '-Godlike-'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Splash'

  describe '.tagDOTA2DescHeroicCourierKill()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/courier kill' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicCourierKill @description

    afterEach () ->
      @description = null

    it 'it should detect heroic courier kill item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_COURIERKILL

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Natus Vincere'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Alliance'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Food'

  describe '.tagDOTA2DescHeroicAllyDenied()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/ally denied' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicAllyDenied @description

    afterEach () ->
      @description = null

    it 'it should detect heroic ally denied item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_ALLYDENIED

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'APETACO'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'solen'

  describe '.tagDOTA2DescHeroicAegisDenied()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/aegis denied' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicAegisDenied @description

    afterEach () ->
      @description = null

    it 'it should detect heroic aegis denied item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_AEGISDENIED

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'GameOn.'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Tegu Opa'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Speedy'

  describe '.tagDOTA2DescHeroicAegisSnatch()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/aegis snatch' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicAegisSnatch @description

    afterEach () ->
      @description = null

    it 'it should detect heroic aegis snatch item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_AEGISSNATCH

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'MOSCOWITA POWER'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: '300 The Return'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Hello'

  describe '.tagDOTA2DescHeroicEarlyRoshan()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/early roshan' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicEarlyRoshan @description

    afterEach () ->
      @description = null

    it 'it should detect heroic early roshan item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_EARLYROSHAN

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name:'New Age AR'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name:'VolcaniaGaming'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'zhimoneta'

  describe '.tagDOTA2DescHeroicRapier()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/rapier' )
      TagsDOTA2Reducer::tagDOTA2DescHeroicRapier @description

    afterEach () ->
      @description = null

    it 'it should detect heroic rapier item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_RAPIER

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Immortal Fire.'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Yolo Swagerino'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'FUCK YOU CHINA'

  describe '.tagDOTA2DescHeroic5EchoSlam()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/dota2/description/heroic/echo slam' )
      TagsDOTA2Reducer::tagDOTA2DescHeroic5EchoSlam @description

    afterEach () ->
      @description = null

    it 'it should detect heroic 5 echo slam item', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_HEROIC
        name: CHOICE_5ECHOSLAM

    it 'it should detect teams', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Team Empire'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Cloud9 G2A'

    it 'it should detect players', () ->
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'VANSKOR'

  describe '.tagDOTA2DescPlayerCardPlayer()', () ->
    it 'it should detect player card item player', () ->
      description = __mock__( 'tags/dota2/description/player/card/player/maximilian broecker' )

      TagsDOTA2Reducer::tagDOTA2DescPlayerCardPlayer description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'Maximilian Broecker'

    it 'it should support player nickname', () ->
      description = __mock__( 'tags/dota2/description/player/card/player/qojqva' )

      TagsDOTA2Reducer::tagDOTA2DescPlayerCardPlayer description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'qojqva (Maximilian Broecker)'

  describe '.tagDOTA2DescPlayerCardTeam()', () ->
    it 'it should detect player card item team', () ->
      description = __mock__( 'tags/dota2/description/player/card/team/alliance' )

      TagsDOTA2Reducer::tagDOTA2DescPlayerCardTeam description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Alliance'

  describe '.tagDOTA2DescGem()', () ->
    it 'it should detect track gem in gem name', () ->
      description = __mock__( 'tags/dota2/description/gem/track/name/games watched/navi' )
      gem = __mock__( 'tags/dota2/description/gem/track/name/games watched/matched/navi' )

      TagsDOTA2Reducer::tagDOTA2DescGem description, gem
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TRACK
        name: 'Games Watched (NaVi)'

    it 'it should detect track gem in gem value', () ->
      description = __mock__( 'tags/dota2/description/gem/track/value/barracks destroyed' )
      gem = __mock__( 'tags/dota2/description/gem/track/value/matched/barracks destroyed' )

      TagsDOTA2Reducer::tagDOTA2DescGem description, gem
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TRACK
        name: 'Barracks Destroyed'

    it 'it should detect autograph rune', () ->
      description = __mock__( 'tags/dota2/description/gem/autograph/andrey dread golubev' )
      gem = __mock__( 'tags/dota2/description/gem/autograph/matched/andrey dread golubev' )

      TagsDOTA2Reducer::tagDOTA2DescGem description, gem
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_AUTOGRAPHRUNE
        name: 'Andrey \'Dread\' Golubev'

    it 'it should detect others gems', () ->
      description = __mock__( 'tags/dota2/description/gem/kinetic/sylvan cascade' )
      gem = __mock__( 'tags/dota2/description/gem/kinetic/matched/sylvan cascade' )

      TagsDOTA2Reducer::tagDOTA2DescGem description, gem
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_GEM_KINETIC
        name: 'Sylvan Cascade!'

  describe '.tagDOTA2DescGems()', () ->
    it 'it should detect all gems', () ->
      description = __mock__( 'tags/dota2/description/gem/kinetic/sylvan cascade' )

      TagsDOTA2Reducer::tagDOTA2DescGems description
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TRACK
        name: 'Buildings Focus Fired'
      expect( description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_GEM_KINETIC
        name: 'Sylvan Cascade!'
