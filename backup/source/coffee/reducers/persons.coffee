class PersonsReducer

  initialState:
    state: PERSONSCLUB_IDLE
    current: 0
    total: 0
    persons: []

  reset: ( state ) ->
    state.state = PERSONSCLUB_OUTDATED
    state.current = 0
    state.persons = []
    state.total = state.persons.length
    return state

  populate: ( state, action ) ->
    state.state = PERSONSCLUB_IDLE
    state.current = 0
    state.persons = action.persons if action?.persons?
    state.total = state.persons.length
    return state

  unshift: ( state, action ) ->
    state.persons.unshift action.person
    state.total = state.persons.length
    return state

  queue: ( state ) ->
    state.state = PERSONSCLUB_QUEUE
    _.each state.persons, ( person, index ) =>
      person.state = PERSON_QUEUE
    return state

  state: ( state, action ) ->
    state.state = action.type
    return state

  statePerson: ( state, action ) ->
    person = _.find state.persons, steamId32: action.person.steamId32
    person.state = action.type if person?
    return state

  increment: ( state ) ->
    state.current++ if state.current < state.total
    return state

  reducer: ( state = @initialState, action ) ->
    switch action.type
      when REDUX_INIT, SETTINGS_CHANGED
        @reset state
      when PERSONSCLUB_ADD
        @populate state, action
      when PERSONSCLUB_QUEUE
        @queue state
      when PERSONSCLUB_IDLE, PERSONSCLUB_PROCESS, PERSONSCLUB_PAUSE, PERSONSCLUB_RESUME, PERSONSCLUB_DRAIN
        @state state, action
      when PERSON_ADD
        @unshift state, action
      when PERSON_LOADING, PERSON_ERROR
        @statePerson state, action
      when PERSON_LOADED, PERSON_EMPTY, PERSON_BUSY
        @increment state
        @statePerson state, action
    return state

  constructor: () ->
    return @reducer.bind @
