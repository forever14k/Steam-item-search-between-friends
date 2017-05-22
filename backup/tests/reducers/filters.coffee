describe 'reducers/filters', () ->
  beforeEach () ->
    @mockState = __mock__( 'filters/state/initial' )

  afterEach () ->
    @mockState = null

  describe '.reset()', () ->
    beforeEach () ->
      @mockAction = __mock__( 'common/action/init' )
      @testState = FiltersReducer::reset @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should disable all filters', () ->
      _.each @mockState, ( filter ) =>
        expect( filter.enabled ).toBe( false )

    it 'it should clear all options', () ->
      _.each @mockState, ( filter ) =>
        expect( filter.options.length ).toBe( 0 )

    it 'it should clear all selected options', () ->
      _.each @mockState, ( filter ) =>
        expect( filter.selected.length ).toBe( 0 )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.push()', () ->
    beforeEach () ->
      @idleOptions = FiltersReducer::idleOptions
      FiltersReducer::idleOptions = __mock__( 'filters/function/push/idle' )
      _.each __mock__( 'filters/function/push/options' ), ( data ) =>
        @testState = FiltersReducer::push @mockState, data[ 0 ], data[ 1 ], data[ 2 ]

    afterEach () ->
      FiltersReducer::idleOptions = @idleOptions
      @testState = null

    it 'it should create new filter', () ->
      expect( @mockState[ 'Tradable' ] ).toBeDefined()

    it 'it should push option to filter', () ->
      expect( @mockState[ 'Tradable' ].options.length ).toBe( 2 )

    it 'it should support option color', () ->
      expect( _.first( @mockState[ 'Tradable' ].options ).color ).toBe( 'ffffff' )

    it 'it should enable filter if atleast 1 option', () ->
      expect( @mockState[ 'Marketable' ].enabled ).toBe( true )

    describe 'idle filters', () ->
      it 'it should not enable filter if only 1 option', () ->
        expect( @mockState[ 'Name Changed' ].enabled ).toBe( false )

      it 'it should enable filter if more then 1 options', () ->
        expect( @mockState[ 'Description Changed' ].enabled ).toBe( true )

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.process()', () ->
    it 'it should not .push() filter if tag is disclosed ( ._filter: true )', () ->
      spyOn FiltersReducer::, 'push'

      FiltersReducer::process @mockState, __mock__( 'filters/function/process/true' )
      expect( FiltersReducer::push ).toHaveBeenCalled()

    it 'it should not .push() filter if tag is disclosed ( ._filter: undefined )', () ->
      spyOn FiltersReducer::, 'push'

      FiltersReducer::process @mockState, __mock__( 'filters/function/process/undefined' )
      expect( FiltersReducer::push ).toHaveBeenCalled()

    it 'it should .push() filter if tag is not disclosed ( ._filter: false )', () ->
      spyOn FiltersReducer::, 'push'

      FiltersReducer::process @mockState, __mock__( 'filters/function/process/false' )
      expect( FiltersReducer::push ).not.toHaveBeenCalled()

    it 'it should support tag color', () ->
      spyOn FiltersReducer::, 'push'

      FiltersReducer::process @mockState, __mock__( 'filters/function/process/color/ffffff' )
      expect( FiltersReducer::push ).toHaveBeenCalledWith @mockState, 'Tradable', 'Tradable', 'ffffff'

    it 'it should return new state', () ->
      testState = FiltersReducer::process @mockState, __mock__( 'filters/functionProcessTrue' )
      expect( testState ).toEqual( @mockState )

  describe '.filter()', () ->
    it 'it should not treat failed backpacks', () ->
      @mockAction = __mock__( 'filters/action/PERSON_LOADED/failure' )

      testState = FiltersReducer::filter @mockState, @mockAction
      expect( @mockState[ 'Clean' ] ).not.toBeDefined()

    beforeEach () ->
      @mockAction = __mock__( 'filters/action/PERSON_LOADED/success' )
      @testState = FiltersReducer::filter @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should process descriptions .tags', () ->
      expect( @mockState[ 'Tradable' ] ).toBeDefined()

    it 'it should process descriptions .sisbftags', () ->
      expect( @mockState[ 'Marketable' ] ).toBeDefined()

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.select()', () ->
    beforeEach () ->
      @mockAction = __mock__( 'filters/action/FILTERS_SELECTED/initial/third' )
      @testState = FiltersReducer::select @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should push filter option to selected', () ->
      expect( @mockState[ 'initial' ].selected ).toContain jasmine.objectContaining
        name: 'third'

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.remove()', () ->
    beforeEach () ->
      @mockState.initial = __mock__( 'filters/state/selected/second' )
      @mockAction = __mock__( 'filters/action/FILTERS_REMOVED/initial/second' )
      @testState = FiltersReducer::remove @mockState, @mockAction

    afterEach () ->
      @mockAction = null
      @testState = null

    it 'it should remove selected option from filter', () ->
      expect( @mockState[ 'initial' ].selected ).not.toContain jasmine.objectContaining
        name: 'second'

    it 'it should return new state', () ->
      expect( @testState ).toEqual( @mockState )

  describe '.reducer()', () ->
    beforeEach () ->
      @testFiltersReducer = new FiltersReducer

    afterEach () ->
      @testFiltersReducer = null

    it 'it should set initial state', () ->
      mockAction = __mock__( 'common/action/test' )

      testState = @testFiltersReducer undefined, mockAction
      expect( testState ).toBeDefined()

    it 'it should return new state', () ->
      mockAction = __mock__( 'common/action/test' )

      testState = @testFiltersReducer @mockState, mockAction
      expect( testState ).toEqual( @mockState )

    describe 'REDUX_INIT', () ->
      it 'it should reset state', () ->
        mockAction = __mock__( 'common/action/init' )

        @testFiltersReducer @mockState, mockAction
        _.each @mockState, ( filter ) =>
            expect( filter.enabled ).toBe( false )
            expect( filter.options.length ).toBe( 0 )
            expect( filter.selected.length ).toBe( 0 )

    describe 'SETTINGS_CHANGED', () ->
      it 'it should reset state', () ->
        mockAction = __mock__( 'filters/action/SETTINGS_CHANGED/730_4' )

        @testFiltersReducer @mockState, mockAction
        _.each @mockState, ( filter ) =>
            expect( filter.enabled ).toBe( false )
            expect( filter.options.length ).toBe( 0 )
            expect( filter.selected.length ).toBe( 0 )

    describe 'PERSON_LOADED', () ->
      it 'it should treat backpacks to filters', () ->
        mockAction = __mock__( 'filters/action/PERSON_LOADED/success' )

        @testFiltersReducer @mockState, mockAction
        expect( @mockState[ 'Tradable' ] ).toBeDefined()
        expect( @mockState[ 'Marketable' ] ).toBeDefined()

    describe 'FILTERS_SELECTED', () ->
      it 'it should select option in filter', () ->
        mockAction = __mock__( 'filters/action/FILTERS_SELECTED/initial/third' )

        @testFiltersReducer @mockState, mockAction
        expect( @mockState[ 'initial' ].selected ).toContain jasmine.objectContaining
          name: 'third'

    describe 'FILTERS_REMOVED', () ->
      it 'it should remove selected option in filter', () ->
        @mockState.initial = __mock__( 'filters/state/selected/second' )
        mockAction = __mock__( 'filters/action/FILTERS_REMOVED/initial/second' )

        @testFiltersReducer @mockState, mockAction
        expect( @mockState[ 'initial' ].selected ).not.toContain jasmine.objectContaining
          name: 'second'

    describe 'FILTERS_REPLACED', () ->
      it 'it should replace selected option in filter', () ->
        @mockState.initial = __mock__( 'filters/state/selected/second' )
        mockAction = __mock__( 'filters/action/FILTERS_REPLACED/initial/second-third' )

        @testFiltersReducer @mockState, mockAction

        expect( @mockState[ 'initial' ].selected ).toContain jasmine.objectContaining
          name: 'third'
        expect( @mockState[ 'initial' ].selected ).not.toContain jasmine.objectContaining
          name: 'second'

  describe '.constructor()', () ->
    it 'it should return .reducer()', () ->
      spyOn FiltersReducer::, 'reducer'

      mockAction = __mock__( 'common/action/test' )
      testFiltersReducer = new FiltersReducer
      testFiltersReducer undefined, mockAction
      expect( FiltersReducer::reducer ).toHaveBeenCalledWith undefined, mockAction
