describe 'reducers/menu', () ->
  beforeEach () ->
    @mockState = __mock__( 'menu/state/initial' )
    $.removeCookie @mockState.cookie

  afterEach () ->
    @mockState = null

  describe '.setCookie()', () ->
    beforeEach () ->
      @testState = MenuReducer::setCookie @mockState

    afterEach () ->
      @testState = null

    it 'it should set Steam Last Inventory cookie from state', () ->
      expect( $.cookie( @mockState.cookie ) ).toBe( '570_2' )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.getCookie()', () ->
    beforeEach () ->
      $.cookie @mockState.cookie, '753_6'
      @testState = MenuReducer::getCookie @mockState

    afterEach () ->
      @testState = null

    it 'it should get Steam Last Inventory cookie to state', () ->
      expect( @mockState.appid ).toBe( '753' )
      expect( @mockState.contextid ).toBe( '6' )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.checkCookie()', () ->
    beforeEach () ->
      $.cookie @mockState.cookie, '753_6'
      @testState = MenuReducer::checkCookie @mockState

    afterEach () ->
      @testState = null

    it 'it should update state from Steam Last Inventory cookie', () ->
      expect( @mockState.appid ).toBe( '753' )
      expect( @mockState.contextid ).toBe( '6' )
      expect( $.cookie( @mockState.cookie ) ).toBe( '753_6' )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.appid()', () ->
    beforeEach () ->
      @mockAction = __mock__( 'menu/action/APPID_CHANGED/440' )
      @testState = MenuReducer::appid @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should update appid in state from action', () ->
      expect( @mockState.appid ).toBe( '440' )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.contextid()', () ->
    beforeEach () ->
      @mockAction = __mock__( 'menu/action/CONTEXTID_CHANGED/6' )
      @testState = MenuReducer::contextid @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should update contextid in state from action', () ->
      expect( @mockState.contextid ).toBe( '6' )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.search()', () ->
    beforeEach () ->
      @mockAction = __mock__( 'menu/action/SEARCH_CHANGED/sisbf' )
      @testState = MenuReducer::search @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should update search in state from action', () ->
      expect( @mockState.search ).toBe( 'sisbf' )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.reducer()', () ->
    beforeEach () ->
      @testMenuReducer = new MenuReducer
      $.removeCookie @mockState.cookie

    afterEach () ->
      @testMenuReducer = null

    it 'it should set initial state', () ->
      mockAction = __mock__( 'common/action/test' )
      testState = @testMenuReducer undefined, mockAction
      expect( testState ).toBeDefined()

    it 'it should return new state', () ->
      mockAction = __mock__( 'common/action/test' )
      testState = @testMenuReducer @mockState, mockAction
      expect( testState ).toEqual( @mockState )

    describe 'REDUX_INIT', () ->
      it 'it should set appid and contextid from Steam Last Inventory cookie', () ->
        mockAction = __mock__( 'common/action/init' )
        $.cookie @mockState.cookie, '753_6'

        @testMenuReducer @mockState, mockAction
        expect( @mockState.appid ).toBe( '753' )
        expect( @mockState.contextid ).toBe( '6' )
        expect( $.cookie( @mockState.cookie ) ).toBe( '753_6' )

    describe 'SETTINGS_CHANGED', () ->
      beforeEach () ->
        @mockAction = __mock__( 'menu/action/SETTINGS_CHANGED/730_4' )

      afterEach () ->
        @mockAction = null

      it 'it should update state appid and contextid', () ->
        @testMenuReducer @mockState, @mockAction
        expect( @mockState.appid ).toBe( '730' )
        expect( @mockState.contextid ).toBe( '4' )

      it 'it should set Steam Last Inventory cookie', () ->
        @testMenuReducer @mockState, @mockAction
        expect( $.cookie( @mockState.cookie ) ).toBe( '730_4' )

    describe 'APPID_CHANGED', () ->
      beforeEach () ->
        @mockAction = __mock__( 'menu/action/APPID_CHANGED/730' )

      afterEach () ->
        @mockAction = null

      it 'it should update state appid', () ->
        @testMenuReducer @mockState, @mockAction
        expect( @mockState.appid ).toBe( '730' )

      it 'it should set Steam Last Inventory cookie', () ->
        @testMenuReducer @mockState, @mockAction
        expect( $.cookie( @mockState.cookie ) ).toBe( '730_2' )

    describe 'CONTEXTID_CHANGED', () ->
      beforeEach () ->
        @mockAction = __mock__( 'menu/action/CONTEXTID_CHANGED/4' )

      afterEach () ->
        @mockAction = null

      it 'it should update state contextid', () ->
        @testMenuReducer @mockState, @mockAction
        expect( @mockState.contextid ).toBe( '4' )

      it 'it should set Steam Last Inventory cookie', () ->
        @testMenuReducer @mockState, @mockAction
        expect( $.cookie( @mockState.cookie ) ).toBe( '570_4' )

    describe 'SEARCH_CHANGED', () ->
      it 'it should update state search', () ->
        mockAction = __mock__( 'menu/action/SEARCH_CHANGED/sisbf' )

        @testMenuReducer @mockState, mockAction
        expect( @mockState.search ).toBe( 'sisbf' )

  describe '.constructor()', () ->
    it 'it should return .reducer()', () ->
      spyOn MenuReducer::, 'reducer'

      mockAction = __mock__( 'common/action/test' )
      testMenuReducer = new MenuReducer
      testMenuReducer undefined, mockAction
      expect( MenuReducer::reducer ).toHaveBeenCalledWith undefined, mockAction
