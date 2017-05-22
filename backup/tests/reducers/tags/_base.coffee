describe 'reducers/tags/_base', () ->
  beforeEach () ->
    @mockState = __mock__( 'tags/_base/state/initial' )

  afterEach () ->
    @mockState = null

  describe '._middlewares()', () ->
    beforeEach () ->
      @middlewares = TagsBaseReducer::middlewares
      TagsBaseReducer::testMiddleware = _.noop
      TagsBaseReducer::middlewares = [
        'testMiddleware'
        'testMiddlewareUndefined'
      ]
      TagsBaseReducer::_middlewares()

    afterEach () ->
      TagsBaseReducer::middlewares = @middlewares

    it 'it should tranform .middlewares[] functions names to private functions', () ->
      _.each ( TagsBaseReducer::middlewares ), ( middleware ) ->
        expect( _.isFunction( middleware ) ).toBe( true )

  describe '.process()', () ->
    it 'it should not treat failed backpacks', () ->
      description = __mock__( 'tags/_base/action/PERSON_LOADED/failure' )
      spyOn TagsBaseReducer::, 'invoke'

      TagsBaseReducer::process @mockState, description
      expect( TagsBaseReducer::invoke ).not.toHaveBeenCalled()

    describe 'it should treat success backpacks', () ->
      beforeEach () ->
        mockAction = __mock__( 'tags/_base/action/PERSON_LOADED/success' )
        spyOn TagsBaseReducer::, 'isAppId'
          .and
          .callThrough()
        spyOn TagsBaseReducer::, 'invoke'
        TagsBaseReducer::process @mockState, mockAction

      it 'it should check description appId', () ->
        expect( TagsBaseReducer::isAppId ).toHaveBeenCalled()

      it 'it should .invoke()', () ->
        expect( TagsBaseReducer::invoke ).toHaveBeenCalled()

  describe '.invoke()', () ->
    beforeEach () ->
      @middlewares = TagsBaseReducer::middlewares
      TagsBaseReducer::middlewares = [
        _.noop
        _.noop
        _.noop
      ]

    afterEach () ->
      TagsBaseReducer::middlewares = @middlewares

    it 'it should invoke all .middlewares[]', () ->
      description = __mock__( 'tags/_base/description/empty' )
      _.each TagsBaseReducer::middlewares, ( middleware, index ) ->
        spyOn TagsBaseReducer::middlewares, index

      TagsBaseReducer::invoke description
      _.each TagsBaseReducer::middlewares, ( middleware, index ) ->
        expect( TagsBaseReducer::middlewares[ index ] ).toHaveBeenCalledWith description

  describe '.insert()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/_base/description/empty' )
      @tag = __mock__( 'tags/_base/tags/tradable' )

      TagsBaseReducer::insert @description, @tag

    afterEach () ->
      @description = null
      @tag = null

    it 'it should create ._sisbftags in description if not exists', () ->
      expect( @description._sisbftags ).toBeDefined()

    it 'it should push tag to ._sisbftags if not exists', () ->
      expect( @description._sisbftags ).toContain( @tag )

  describe '.isAppId()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/_base/description/appid/570' )

    afterEach () ->
      @description = null

    it 'it should return true if appId is null', () ->
      isAppId = TagsBaseReducer::isAppId @description, @mockState.appId
      expect( isAppId ).toBe( true )

    it 'it should return true if appId equal description.appid', () ->
      @mockState = __mock__( 'tags/_base/state/570' )

      isAppId = TagsBaseReducer::isAppId @description, @mockState.appId
      expect( isAppId ).toBe( true )

    it 'it should return false if appId not equal description.appid', () ->
      @mockState = __mock__( 'tags/_base/state/730' )

      isAppId = TagsBaseReducer::isAppId @description, @mockState.appId
      expect( isAppId ).toBe( false )

  describe '.isHaveDescriptions()', () ->
    it 'it should return true if description have descriptions', () ->
      description = __mock__( 'tags/_base/description/descriptions/1' )

      isHaveDescriptions = TagsBaseReducer::isHaveDescriptions description
      expect( isHaveDescriptions ).toBe( true )

    it 'it should return false if description have descriptions', () ->
      description = __mock__( 'tags/_base/description/empty' )

      isHaveDescriptions = TagsBaseReducer::isHaveDescriptions description
      expect( isHaveDescriptions ).toBe( false )

  describe '.isHaveFraudWarnings()', () ->
    it 'it should return true if description have fraudwarnings', () ->
      description = __mock__( 'tags/_base/description/fraudwarnings/1' )

      isHaveFraudWarnings = TagsBaseReducer::isHaveFraudWarnings description
      expect( isHaveFraudWarnings ).toBe( true )

    it 'it should return false if description have fraudwarnings', () ->
      description = __mock__( 'tags/_base/description/empty' )

      isHaveFraudWarnings = TagsBaseReducer::isHaveFraudWarnings description
      expect( isHaveFraudWarnings ).toBe( false )

  describe '.tagDesc()', () ->
    beforeEach () ->
      @description = __mock__( 'tags/_base/description/descriptions/heroic/rapier' )
      @config =
        regex: REGEX_HEROIC_RAPIER
        option: OPTION_HEROIC
      spyOn TagsBaseReducer::, 'isHaveDescriptions'
        .and
        .callThrough()
      spyOn TagsBaseReducer::, 'insert'
        .and
        .callThrough()

    afterEach () ->
      @description = null
      @config = null

    it 'it should check if description have descriptions', () ->
      TagsBaseReducer::tagDesc @description, @config
      expect( TagsBaseReducer::isHaveDescriptions ).toHaveBeenCalled()

    it 'it should find matched descriptions', () ->
      TagsBaseReducer::tagDesc @description, @config
      expect( TagsBaseReducer::insert ).toHaveBeenCalled()

    describe 'it should insert tag with', () ->
      it 'passed value', () ->
        @config.value = CHOICE_RAPIER

        TagsBaseReducer::tagDesc @description, @config
        expect( @description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_HEROIC
          name: CHOICE_RAPIER

      it 'matched value', () ->
        TagsBaseReducer::tagDesc @description, @config
        expect( @description._sisbftags ).toContain jasmine.objectContaining
          category_name: OPTION_HEROIC
          name: 'gramovsky'

    it 'it should insert tags if order specified', () ->
      @config.order = [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]

      TagsBaseReducer::tagDesc @description, @config
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_PLAYER
        name: 'gramovsky'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'I\'m creating hope'
      expect( @description._sisbftags ).toContain jasmine.objectContaining
        category_name: OPTION_TEAM
        name: 'Call For Hell'

  describe '.reducer()', () ->
    beforeEach () ->
      @testTagsBaseReducer = new TagsBaseReducer

    afterEach () ->
      @testTagsBaseReducer = null

    it 'it should set initial state', () ->
      mockAction = __mock__( 'common/action/test' )

      testState = @testTagsBaseReducer undefined, mockAction
      expect( testState ).toBeDefined()

    it 'it should return new state', () ->
      mockAction = __mock__( 'common/action/test' )

      testState = @testTagsBaseReducer @mockState, mockAction
      expect( testState ).toEqual( @mockState )

    describe 'PERSON_LOADED', () ->
      it 'it should insert process descriptions through middlewares', () ->
        mockAction = __mock__( 'tags/_base/action/PERSON_LOADED/success' )
        spyOn TagsBaseReducer::, 'invoke'

        @testTagsBaseReducer @mockState, mockAction
        expect( TagsBaseReducer::invoke ).toHaveBeenCalled()

  describe '.constructor()', () ->
    it 'it should return .reducer()', () ->
      spyOn TagsBaseReducer::, 'reducer'

      mockAction = __mock__( 'common/action/test' )
      testTagsBaseReducer = new TagsBaseReducer
      testTagsBaseReducer undefined, mockAction
      expect( TagsBaseReducer::reducer ).toHaveBeenCalledWith undefined, mockAction
