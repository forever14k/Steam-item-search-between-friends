class DebugReducer

  initialState: true

  stats:
    loaded: 0
    error: 0
    busy: 0
    empty: 0

  reducer: ( state = @initialState, action ) ->
    switch action.type
      when REDUX_INIT, SETTINGS_CHANGED
        @stats =
          loaded: 0
          error: 0
          busy: 0
          empty: 0
      when PERSON_LOADED
        @stats.loaded++
      when PERSON_ERROR
        @stats.error++
      when PERSON_EMPTY
        @stats.empty++
      when PERSON_BUSY
        @stats.busy++
    console.log 'ACTION', action
    console.log ( @stats.loaded + @stats.busy + @stats.empty ), @stats, "#{QUEUE_RPM} RPM"
    return state

  constructor: () ->
    return @reducer.bind @
