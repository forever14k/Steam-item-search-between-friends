describe 'reducers/backpacks', () ->
  beforeEach () ->
    @mockState = __mock__( 'backpacks/state/initial' )

  afterEach () ->
    @mockState = null

  describe '.reset()', () ->
    beforeEach () ->
      @mockAction = __mock__( 'common/action/init' )
      @testState = BackpacksReducer::reset @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should reset .items[]', () ->
      expect( @mockState.items.length ).toBe( 0 )

    it 'it should reset .descriptions{}', () ->
      expect( _.keys( @mockState.descriptions ).length ).toBe( 0 )

    it 'it should reset .results[]', () ->
      expect( _.keys( @mockState.results ).length ).toBe( 0 )

    it 'it should set .state to BACKPACKS_NOTDISPLAYED', () ->
      expect( @mockState.state ).toBe( BACKPACKS_NOTDISPLAYED )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.state()', () ->
    beforeEach () ->
      @mockAction = __mock__( 'backpacks/action/BACKPACKS_NOTDISPLAYED' )
      @testState = BackpacksReducer::state @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should set .state to action.type', () ->
      expect( @mockState.state ).toBe( BACKPACKS_NOTDISPLAYED )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.push()', () ->
    it 'it should not treat failed backpacks', () ->
      mockAction = __mock__( 'backpacks/action/PERSON_LOADED/failure' )
      spyOn @mockState.items, 'push'

      BackpacksReducer::push @mockState, mockAction
      expect( @mockState.items.push ).not.toHaveBeenCalled()

    beforeEach () ->
      @mockAction = __mock__( 'backpacks/action/PERSON_LOADED/success' )

    afterEach () ->
      @mockAction = null

    it 'it should detect description color', () ->
      spyOn @mockState.items, 'push'

      BackpacksReducer::push @mockState, @mockAction
      expect( @mockState.items.push ).toHaveBeenCalledWith jasmine.objectContaining
        color: 'ffffff'

    beforeEach () ->
      @testState = BackpacksReducer::push @mockState, @mockAction

    afterEach () ->
      @testState = null

    it 'it should push item description to .descriptions', () ->
      expect( @mockState.descriptions[ '0_14000' ] ).toBeDefined()

    it 'it should fallback description market_name with name', () ->
      expect( @mockState.descriptions[ '0_14000' ].market_name ).toBe( 'sisbf' )

    it 'it should push item asset to .items', () ->
      expect( @mockState.items ).toContain jasmine.objectContaining
        itemId: '14000'

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.passed()', () ->
    beforeEach () ->
      @mockState.results = {}
      @testState = BackpacksReducer::passed @mockState, '0_1'

    afterEach () ->
      @testState = null

    it 'it should populate results with passed descriptionId', () ->
      expect( @mockState.results?[ STATUS_INGAME ]?[ '44336602' ]?[ '0' ] ).toBeDefined()
      expect( @mockState.results?[ STATUS_INGAME ]?[ '44336602' ]?[ '3' ] ).toBeDefined()
      expect( @mockState.results?[ STATUS_INGAME ]?[ '44336602' ]?[ '1' ] ).not.toBeDefined()

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.search()', () ->
    beforeEach () ->
      @mockAction = __mock__( 'backpacks/action/BACKPACKS_SEARCH/tradable' )
      @testState = BackpacksReducer::search @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should populate results', () ->
      expect( _.keys( @mockState.results?[ STATUS_INGAME ]?[ '44336602' ] ).length ).toBe( 3 )

    it 'it should set .state to BACKPACKS_NOTDISPLAYED', () ->
      expect( @mockState.state ).toBe( BACKPACKS_NOTDISPLAYED )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.filter()', () ->
    it 'it should check market_name', () ->
      search = ''
      filters = __mock__( 'backpacks/function/filter/empty' )
      description = __mock__( 'backpacks/description/market_name/empty' )

      inspection = BackpacksReducer::filter description, search, filters
      expect( inspection ).toBe( true )

    it 'it should compare search string to market_name', () ->
      search = 'item'
      filters = __mock__( 'backpacks/function/filter/empty' )
      description = __mock__( 'backpacks/description/market_name/item1' )

      inspection = BackpacksReducer::filter description, search, filters
      expect( inspection ).toBe( true )

    it 'it should check .tags', () ->
      search = ''
      filters = __mock__( 'backpacks/function/filter/tradable' )
      description = __mock__( 'backpacks/description/tags/tradable' )

      inspection = BackpacksReducer::filter description, search, filters
      expect( inspection ).toBe( true )

    it 'it should check .sisbftags', () ->
      search = ''
      filters = __mock__( 'backpacks/function/filter/tradable' )
      description = __mock__( 'backpacks/description/_sisbftags/tradable' )

      inspection = BackpacksReducer::filter description, search, filters
      expect( inspection ).toBe( true )

  describe '.reducer()', () ->
    beforeEach () ->
      @testBackpacksReducer = new BackpacksReducer

    afterEach () ->
      @testBackpacksReducer = null

    it 'it should set initial state', () ->
      mockAction = __mock__( 'common/action/test' )

      testState = @testBackpacksReducer undefined, mockAction
      expect( testState ).toBeDefined()

    it 'it should return new state', () ->
      mockAction = __mock__( 'common/action/test' )

      testState = @testBackpacksReducer @mockState, mockAction
      expect( testState ).toEqual( @mockState )

    describe 'REDUX_INIT', () ->
      it 'it should reset state', () ->
        mockAction = __mock__( 'common/action/init' )

        @testBackpacksReducer @mockState, mockAction
        expect( @mockState.items.length ).toBe( 0 )
        expect( _.keys( @mockState.descriptions ).length ).toBe( 0 )
        expect( _.keys( @mockState.results ).length ).toBe( 0 )
        expect( @mockState.state ).toBe( BACKPACKS_NOTDISPLAYED )

    describe 'SETTINGS_CHANGED', () ->
      it 'it should reset state', () ->
        mockAction = __mock__( 'backpacks/action/SETTINGS_CHANGED/730_4' )

        @testBackpacksReducer @mockState, mockAction
        expect( @mockState.items.length ).toBe( 0 )
        expect( _.keys( @mockState.descriptions ).length ).toBe( 0 )
        expect( _.keys( @mockState.results ).length ).toBe( 0 )
        expect( @mockState.state ).toBe( BACKPACKS_NOTDISPLAYED )

    describe 'PERSON_LOADED', () ->
      it 'it should populate state filters', () ->
        mockAction = __mock__( 'backpacks/action/PERSON_LOADED/success' )

        @testBackpacksReducer @mockState, mockAction
        expect( @mockState.descriptions[ '0_14000' ] ).toBeDefined()
        expect( @mockState.items ).toContain jasmine.objectContaining
          itemId: '14000'

    describe 'BACKPACKS_SEARCH', () ->
      it 'it should search items using action.filters', () ->
        mockAction = __mock__( 'backpacks/action/BACKPACKS_SEARCH/tradable' )

        @testBackpacksReducer @mockState, mockAction
        expect( _.keys( @mockState.results?[ STATUS_INGAME ]?[ '44336602' ] ).length ).toBe( 3 )
        expect( @mockState.state ).toBe( BACKPACKS_NOTDISPLAYED )

    describe 'BACKPACKS_DISPLAYED', () ->
      it 'it should set .state to BACKPACKS_DISPLAYED', () ->
        mockAction = __mock__( 'backpacks/action/BACKPACKS_DISPLAYED' )

        @testBackpacksReducer @mockState, mockAction
        expect( @mockState.state ).toBe( BACKPACKS_DISPLAYED )

  describe '.constructor()', () ->
    it 'it should return .reducer()', () ->
      spyOn PersonsReducer::, 'reducer'

      mockAction = __mock__( 'common/action/test' )
      testBackpacksReducer = new PersonsReducer
      testBackpacksReducer undefined, mockAction
      expect( PersonsReducer::reducer ).toHaveBeenCalledWith undefined, mockAction
