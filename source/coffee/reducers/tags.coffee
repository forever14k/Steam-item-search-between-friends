class TagsReducer

  initialState:
    cleanDefinition: [
      CHOICE_TRADABLE
      CHOICE_NOTGIFTED
      CHOICE_NOTCRAFTED
      CHOICE_NOTCHANGED_NAME
      CHOICE_NOTCHANGED_DESCRIPTION
    ]
    colorOrder: [
      OPTION_CATEGORY
      OPTION_QUALITY
      OPTION_RARITY
    ]
    colorExclude: [
      CHOICE_STANDARD
    ]

  middlewares: [
    'tagColor'
    'tagTypeLevel'
    'tagTypeLimited'
    'tagTypeStrange'
    'tagTradable'
    'tagMarketable'
    'tagChangedName'
    'tagChangedDescripion'
    'tagGifted'
    'tagCrafted'
    'tagClean'
  ]

  _middlewares: () ->
    _.each @middlewares, ( middleware, index ) =>
      @middlewares[ index ] = @[ middleware ]

  _cleanDefinition: () ->
    @initialState.cleanDefinition = _.sortBy @initialState.cleanDefinition

  process: ( state, action ) ->
    if action?.backpack?.success? and action.backpack.success
      descriptions = action.backpack.rgDescriptions
      if descriptions?
        _.each descriptions, ( description ) =>
          _.invokeMap @middlewares, _.call, @, state, description

  insert: ( description, tag ) ->
    description._sisbftags = [] if not description?._sisbftags?
    description._sisbftags.push tag if tag?.name? and not _.find description._sisbftags, tag

  tagColor: ( state, description ) ->
    color = null

    if description?.tags?
      _.each state.colorOrder, ( optionName ) ->
        tag = _.find description.tags, category_name: optionName
        if tag?.color? and not color?
          if not _.includes state.colorExclude, tag.name
            color = tag.color

    tag =
      _filter: false
      _tooltip: false
      category_name: OPTION_COLOR
      name: color
      color: color
    @insert description, tag

  tagTypeLevel: ( state, description ) ->
    level = null

    if description?.type?
      level = description.type.match REGEX_LEVEL
      if level?
        level = level[ 1 ]

    tag =
      category_name: OPTION_LEVEL
      name: level
    @insert description, tag

  tagTypeLimited: ( state, description ) ->
    limited = null
    color = null

    if description?.type?
      limited = description.type.match REGEX_LIMITED
      if limited?
        limited = limited[ 1 ]

    color = description.name_color if description?.name_color?

    tag =
      category_name: OPTION_QUALITY
      name: limited
      color: color
    @insert description, tag

  tagTypeStrange: ( state, description ) ->
    strange = null

    if description?.type?
      strange = description.type.match REGEX_STRANGE
      if strange?
        strange = strange[ 1 ]

    tag =
      category_name: OPTION_TRACK
      name: strange
    @insert description, tag

  tagTradable: ( state, description ) ->
    tradable = null

    if description?.tradable?
      switch description.tradable
        when 0
          tradable = CHOICE_NOTTRADABLE
        when 1
          tradable = CHOICE_TRADABLE

    tag =
      category_name: OPTION_TRADABLE
      name: tradable
    @insert description, tag

  tagMarketable: ( state, description ) ->
    marketable = null

    if description?.marketable?
      switch description.marketable
        when 0
          marketable = CHOICE_NOTMARKETABLE
        when 1
          marketable = CHOICE_MARKETABLE

    tag =
      category_name: OPTION_MARKETABLE
      name: marketable
    @insert description, tag

  tagChangedName: ( state, description ) ->
    renamed = null

    if description?.name?
      renamed = description.name.match REGEX_RENAMED

      if renamed?
        tag =
          _filter: false
          category_name: OPTION_CHANGED_NAME
          name: renamed[ 1 ]
        @insert description, tag

      if renamed?
        renamed = CHOICE_CHANGED_NAME
      else
        renamed = CHOICE_NOTCHANGED_NAME

    tag =
      _tooltip: false
      category_name: OPTION_CHANGED_NAME
      name: renamed
    @insert description, tag

  tagChangedDescripion: ( state, description ) ->
    renamed = null

    if description?.descriptions?
      renamed = _.filter description.descriptions, ( definition ) ->
        REGEX_RENAMED.test definition.value

      if renamed? and renamed.length > 0
        _.each renamed, ( definition ) =>
          tag =
            _filter: false
            category_name: OPTION_CHANGED_DESCRIPTION
            name: definition.value
          @insert description, tag

      if renamed? and renamed.length > 0
        renamed = CHOICE_CHANGED_DESCRIPTION
      else
        renamed = CHOICE_NOTCHANGED_DESCRIPTION

    tag =
      _tooltip: false
      category_name: OPTION_CHANGED_DESCRIPTION
      name: renamed
    @insert description, tag

  tagGifted: ( state, description ) ->
    gifted = null

    if description?.descriptions?
      gifted = _.filter description.descriptions, ( definition ) ->
        REGEX_GIFTED.test definition.value

      if gifted? and gifted.length > 0
        _.each gifted, ( definition ) =>
          giftedFrom = definition.value.match REGEX_GIFTED
          if giftedFrom?
            tag =
              category_name: OPTION_GIFTED_FROM
              name: giftedFrom[ 1 ]
            @insert description, tag

      if gifted? and gifted.length > 0
        gifted = CHOICE_GIFTED
      else
        gifted = CHOICE_NOTGIFTED

    tag =
      _tooltip: false
      category_name: OPTION_GIFTED
      name: gifted
    @insert description, tag

  tagCrafted: ( state, description ) ->
    crafted = null

    if description?.descriptions?
      crafted = _.filter description.descriptions, ( definition ) ->
        REGEX_CRAFTED.test definition.value

      if crafted? and crafted.length > 0
        _.each crafted, ( definition ) =>
          craftedBy = definition.value.match REGEX_CRAFTED
          if craftedBy?
            tag =
              category_name: OPTION_CRAFTED_BY
              name: craftedBy[ 1 ]
            @insert description, tag

      if crafted? and crafted.length > 0
        crafted = CHOICE_CRAFTED
      else
        crafted = CHOICE_NOTCRAFTED

    tag =
      _tooltip: false
      category_name: CHOICE_CRAFTED
      name: crafted
    @insert description, tag

  tagClean: ( state, description ) ->
    clean = null

    if description?._sisbftags?
      tags = _.flatMap description._sisbftags, 'name'
      intersection = _.sortBy _.intersection tags, state.cleanDefinition
      clean = _.isEqual state.cleanDefinition, intersection

      if clean? and clean
        clean = CHOICE_CLEAN
      else
        clean = CHOICE_DIRTY

    tag =
      category_name: OPTION_CLEAN
      name: clean
    @insert description, tag

  reducer: ( state = @initialState, action ) ->
    switch action.type
      when PERSON_LOADED
        @process state, action
    return state

  constructor: () ->
    @_middlewares()
    @_cleanDefinition()
    return @reducer.bind @