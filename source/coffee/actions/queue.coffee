class Queue extends BaseView

  state: null
  queue: null
  request: null
  delay: ( ( 1000 * 60 ) / QUEUE_RPM)
  worker: 1

  onStateChange: () ->
    state = @state.getState().Persons.state
    switch state
      when PERSONSCLUB_QUEUE, PERSONSCLUB_RESUME
        @start()
      when PERSONSCLUB_PAUSE
        @pause()

  onLoading: ( request ) ->
    person = request.person

    @state.dispatch
      type: PERSON_LOADING
      person: person

  onLoaded: ( backpack, status, request ) ->
    person = request.person

    @state.dispatch
      type: PERSON_LOADED
      person: person
      backpack: backpack

  onError: ( request, status, error ) ->
    person = request.person
    switch request.status
      when 403
        @state.dispatch
          type: PERSON_EMPTY
          person: person
      when 500
        @state.dispatch
          type: PERSON_BUSY
          person: person
      else
        @queue.unshift person
        @state.dispatch
          type: PERSON_ERROR
          person: person

  imitation: ( person ) ->
    request =
      person: person
    @onLoading request
    setTimeout (()=>
      if Math.random().toFixed() > 0.5
        @onLoaded {}, 'OK', request
      else
        @onError request
    ), 100

  process: ( person ) ->
    state = @state.getState().Settings

    @request = $.ajax
      method: 'GET'
      url: "//steamcommunity.com/inventory/#{person.steamId64}/#{state.appid}/#{state.contextid}?l=english&count=5000"
      dataType: 'json'
      success: @onLoaded.bind @
      error: @onError.bind @
    @request.person = person

    @onLoading @request

  setup: () ->
    @queue = async.queue ( ( person, callback )=>
      @process person
      person._timeout = setTimeout callback, @delay
    ), @worker

    @queue.drain = () =>
      @state.dispatch
        type: PERSONSCLUB_DRAIN

  start: () ->
    persons = @state.getState().Persons.persons
    queue = _.filter persons, state: PERSON_QUEUE

    @queue._tasks.empty()
    @queue.push queue
    @queue.resume()

    @state.dispatch
      type: PERSONSCLUB_PROCESS

  pause: () ->
    @queue.pause()

  reset: () ->
    if @request
      @request.abort()
    if @queue
      @queue.drain = _.noop
      @queue._tasks.empty()
    @setup()

  constructor: () ->
    super
    if @shouldInitiate()
      @setup()
