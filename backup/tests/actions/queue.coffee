jasmine.Ajax.install() # dont call real public APIs

describe 'actions/queue', () ->
  beforeEach () ->
    @mockState =
      state: {}
      dispatch: _.noop
      getState: () -> @state
      subscribe: _.noop

    @testQueue = new Queue @mockState

  afterEach () ->
    @mockState = null
    @testQueue = null

  describe '.setup()', () ->
    it 'it should setup @testQueue', () ->
      expect( @testQueue.queue ).not.toBeNull()

    describe '@testQueue should have', () ->
      it '._tasks.empty()', () ->
        expect( @testQueue.queue._tasks.empty ).toBeDefined()

      it '.drain()', () ->
        expect( @testQueue.queue.drain ).toBeDefined()

      it '.push()', () ->
        expect( @testQueue.queue.push ).toBeDefined()

      it '.unshift()', () ->
        expect( @testQueue.queue.unshift ).toBeDefined()

      it '.pause()', () ->
        expect( @testQueue.queue.pause ).toBeDefined()

      it '.resume()', () ->
        expect( @testQueue.queue.resume ).toBeDefined()

  describe '.onStateChange()', () ->
    describe 'it should call .start() when .Persons.state is', () ->
      it 'PERSONSCLUB_QUEUE', () ->
        @mockState.state.Persons = __mock__( 'queue/state/persons/PERSONSCLUB_QUEUE/3' )
        spyOn @testQueue, 'start'

        @testQueue.onStateChange()
        expect( @testQueue.start ).toHaveBeenCalled()

      it 'PERSONSCLUB_RESUME', () ->
        @mockState.state.Persons = __mock__( 'queue/state/persons/PERSONSCLUB_RESUME' )
        spyOn @testQueue, 'start'

        @testQueue.onStateChange()
        expect( @testQueue.start ).toHaveBeenCalled()

    describe 'it should not call .start() when .Persons.state is', () ->
      it 'other TYPE', () ->
        @mockState.state.Persons = __mock__( 'queue/state/persons/PERSONSCLUB_IDLE' )
        spyOn @testQueue, 'start'

        @testQueue.onStateChange()
        expect( @testQueue.start ).not.toHaveBeenCalled()

    describe 'it should call .pause() when .Persons.state is', () ->
      it 'PERSONSCLUB_PAUSE', () ->
        @mockState.state.Persons = __mock__( 'queue/state/persons/PERSONSCLUB_PAUSE' )
        spyOn @testQueue, 'pause'

        @testQueue.onStateChange()
        expect( @testQueue.pause ).toHaveBeenCalled()

    describe 'it should not call .pause() when .Persons.state is', () ->
      it 'other TYPE', () ->
        @mockState.state.Persons = __mock__( 'queue/state/persons/PERSONSCLUB_IDLE' )
        spyOn @testQueue, 'pause'

        @testQueue.onStateChange()
        expect( @testQueue.pause ).not.toHaveBeenCalled()

  describe '.start()', () ->
    beforeEach () ->
      @mockState.state.Persons = __mock__( 'queue/state/persons/PERSONSCLUB_QUEUE/3' )
      @mockState.state.Settings = __mock__( 'queue/state/settings/570_2' )

    afterEach () ->
      @testQueue.pause()

    describe 'it should populate queue from .Persons.persons', () ->
      it 'where .person.state is PERSON_QUEUE', () ->
        @testQueue.start()
        expect( @testQueue.queue.length() ).toBe( 2 )

    it 'it should start/resume queue', () ->
      spyOn @testQueue.queue, 'resume'

      @testQueue.start()
      expect( @testQueue.queue.resume ).toHaveBeenCalled()

    it 'it should dispatch PERSONSCLUB_PROCESS', () ->
      spyOn @mockState, 'dispatch'

      @testQueue.start()
      expect( @mockState.dispatch ).toHaveBeenCalledWith jasmine.objectContaining
        type: PERSONSCLUB_PROCESS

  describe '.process()', () ->
    beforeEach () ->
      @mockState.state.Settings = __mock__( 'queue/state/settings/570_2' )

    it 'it should call Steam public API using .Settings', () ->
      spyOn $, 'ajax'
        .and
        .callThrough()

      @testQueue.process __mock__( 'queue/person/44336602' )
      expect( $.ajax ).toHaveBeenCalled()

    describe 'it should call', () ->
      beforeEach () ->
        spyOn @testQueue, 'onLoading'
        spyOn @testQueue, 'onLoaded'
        spyOn @testQueue, 'onError'

        @testQueue.process __mock__( 'queue/person/44336602' )

      describe '.onLoading() before API call starts', () ->
        it '.onLoading() have been called', ( ) ->
          expect( @testQueue.onLoading ).toHaveBeenCalled()

        it '.onLoaded() not have been called', ( ) ->
          expect( @testQueue.onLoaded ).not.toHaveBeenCalled()

        it '.onError() not have been called', ( ) ->
          expect( @testQueue.onError ).not.toHaveBeenCalled()

      describe '.onLoaded() after  API call success', () ->
        beforeEach () ->
          jasmine.Ajax.requests
            .mostRecent()
            .respondWith
              status: 200
              responseText: '{"success": false }'

        it '.onLoading() have been called', ( ) ->
          expect( @testQueue.onLoading ).toHaveBeenCalled()

        it '.onLoaded() have been called', ( ) ->
          expect( @testQueue.onLoaded ).toHaveBeenCalled()

        it '.onError() not have been called', ( ) ->
          expect( @testQueue.onError ).not.toHaveBeenCalled()

      describe '.onError() after API call fails', () ->
        beforeEach () ->
          jasmine.Ajax.requests
            .mostRecent()
            .respondWith
              status: 503
              responseText: '{"success": false }'

        it '.onLoading() have been called', ( ) ->
          expect( @testQueue.onLoading ).toHaveBeenCalled()

        it '.onLoaded() not have been called', ( ) ->
          expect( @testQueue.onLoaded ).not.toHaveBeenCalled()

        it '.onError() have been called', ( ) ->
          expect( @testQueue.onError ).toHaveBeenCalled()

  describe '.onLoading()', () ->
    it 'it should dispatch PERSON_LOADING with person', () ->
      request =
        person: __mock__( 'queue/person/44336602' )
      spyOn @mockState, 'dispatch'

      @testQueue.onLoading request
      expect( @mockState.dispatch ).toHaveBeenCalledWith
        type: PERSON_LOADING
        person: request.person

  describe '.onLoaded()', () ->
    it 'it should dispatch PERSON_LOADED with person and backpack', () ->
      request =
        person: __mock__( 'queue/person/44336602' )
      backpack =
        success: false
      spyOn @mockState, 'dispatch'

      @testQueue.onLoaded backpack, 'OK', request
      expect( @mockState.dispatch ).toHaveBeenCalledWith
        type: PERSON_LOADED
        person: request.person
        backpack: backpack

  describe '.onError()', () ->
    afterEach () ->
      @testQueue.pause()

    it 'it should unshift person to queue', () ->
      request =
        person: __mock__( 'queue/person/44336602' )
      spyOn @testQueue.queue, 'unshift'

      @testQueue.onError request, 'error', 'Error'
      expect( @testQueue.queue.unshift ).toHaveBeenCalledWith request.person

    it 'it should dispatch PERSON_ERROR with person', () ->
      request =
        person: __mock__( 'queue/person/44336602' )
      spyOn @mockState, 'dispatch'

      @testQueue.onError request, 'error', 'Error'
      expect( @mockState.dispatch ).toHaveBeenCalledWith
        type: PERSON_ERROR
        person: request.person

  describe '.pause()', () ->
    it 'it should pause queue', () ->
      spyOn @testQueue.queue, 'pause'

      @testQueue.pause()
      expect( @testQueue.queue.pause ).toHaveBeenCalled()
