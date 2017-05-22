class TagsBaseReducer

  initialState:
    appId: null

  middlewares: []

  _middlewares: () ->
    _.each @middlewares, ( middleware, index ) =>
      @middlewares[ index ] = if @[ middleware ]? then @[ middleware ] else _.noop

  process: ( state, action ) ->
    if action?.backpack?.success is true
      descriptions = action.backpack.rgDescriptions
      if descriptions?
        _.each descriptions, ( description ) =>
          if @isAppId description, state.appId
            @invoke description
    return state

  invoke: ( description ) ->
    _.invokeMap @middlewares, _.call, @, description

  insert: ( description, tag ) ->
    description._sisbftags = [] if not description?._sisbftags?
    description._sisbftags.push tag if tag?.name? and not _.find description._sisbftags, tag

  isAppId: ( description, appId ) ->
    return if description?.appid is appId or appId is null then true else false

  isHaveDescriptions: ( description ) ->
    return if description?.descriptions? then true else false

  isHaveFraudWarnings: ( description ) ->
    return if description?.fraudwarnings? then true else false

  tagDesc: ( description, config ) ->
    if @isHaveDescriptions description
      descriptions = _.filter description.descriptions, ( definition ) ->
        config.regex.test definition.value

      if descriptions? and descriptions.length > 0
        _.each descriptions, ( definition ) =>
          definitionMatch = definition.value.match config.regex

          if definitionMatch?
            tag =
              category_name: config.option
              name: if config.value? then config.value else definitionMatch[ 1 ]
            @insert description, tag

            if config.order?
              _.each config.order, ( option, index ) =>
                tag =
                  category_name: option
                  name: definitionMatch[ ++index ]
                @insert description, tag

  reducer: ( state = @initialState, action ) ->
    switch action.type
      when PERSON_LOADED
        @process state, action
    return state

  constructor: () ->
    @_middlewares()
    return @reducer.bind @
