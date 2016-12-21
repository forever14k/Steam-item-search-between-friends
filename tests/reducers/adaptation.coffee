describe 'reducers/adaptation', () ->
  beforeEach () ->
    @mockState = true

  afterEach () ->
    @mockState = null

  describe '.adapt()', () ->
    it 'it should adapt new inventory object for old methods', () ->
      mockAction = __mock__( 'adaptation/action/PERSON_LOADED/pure' )
      mockReAction = __mock__( 'adaptation/action/PERSON_LOADED/adapted' )

      AdaptationReducer::adapt @mockState, mockAction
      expect( mockAction.backpack.success ).toBe( true )
      expect( mockAction.backpack.rgInventory[ '665167765' ][ 'id' ] ).toBe '665167765'
      expect( mockAction.backpack.rgDescriptions[ '170676678_253068381' ][ 'appid' ] ).toBe '570'
      expect( mockAction.backpack.rgDescriptions[ '170676678_253068381' ][ 'tags' ] ).toContain jasmine.objectContaining
        category_name: OPTION_QUALITY
        name: CHOICE_STANDARD

  describe '.reducer()', () ->
    beforeEach () ->
      @testAdaptationReducer = new AdaptationReducer

    afterEach () ->
      @testAdaptationReducer = null

    it 'it should set initial state', () ->
      mockAction = __mock__( 'common/action/test' )
      testState = @testAdaptationReducer undefined, mockAction
      expect( testState ).toBeDefined()

    it 'it should return new state', () ->
      mockAction = __mock__( 'common/action/test' )
      testState = @testAdaptationReducer @mockState, mockAction
      expect( testState ).toEqual( @mockState )

    describe 'PERSON_LOADED', () ->
      it 'it should adapt new inventory object for old methods', () ->
        mockAction = __mock__( 'adaptation/action/PERSON_LOADED/pure' )

        @testAdaptationReducer @mockState, mockAction
        expect( mockAction.backpack.success ).toBe( true )
        expect( mockAction.backpack.rgInventory[ '665167765' ][ 'id' ] ).toBe '665167765'
        expect( mockAction.backpack.rgDescriptions[ '170676678_253068381' ][ 'appid' ] ).toBe '570'
        expect( mockAction.backpack.rgDescriptions[ '170676678_253068381' ][ 'tags' ] ).toContain jasmine.objectContaining
          category_name: OPTION_QUALITY
          name: CHOICE_STANDARD

  describe '.constructor()', () ->
    it 'it should return .reducer()', () ->
      spyOn AdaptationReducer::, 'reducer'

      mockAction = __mock__( 'common/action/test' )
      testAdaptationReducer = new AdaptationReducer
      testAdaptationReducer undefined, mockAction
      expect( AdaptationReducer::reducer ).toHaveBeenCalledWith undefined, mockAction
