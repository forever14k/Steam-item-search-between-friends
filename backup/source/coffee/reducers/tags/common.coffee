class TagsCommonReducer extends TagsBaseReducer

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
    'tagCommonColor'
    'tagCommonTradable'
    'tagCommonMarketable'
    'tagCommonChangedName'
    'tagCommonNameTag'
    'tagCommonChangedDescripion'
    'tagCommonGifted'
    'tagCommonCrafted'
    'tagCommonClean'
    'tagCommonDescItemSetName'
    'tagCommonDescStyle'
    # 'tagCommonDescDedication'
  ]

  _cleanDefinition: () ->
    @cleanDefinition = _.sortBy @cleanDefinition

  tagCommonColor: ( description ) ->
    color = null

    if description?.tags?
      _.each @colorOrder, ( optionName ) =>
        tag = _.find description.tags, category_name: optionName
        if tag?.color? and not color?
          if not _.includes @colorExclude, tag.name
            color = tag.color

    if color?
      tag =
        _filter: false
        _tooltip: false
        category_name: OPTION_COLOR
        name: color
        color: color
      @insert description, tag

  tagCommonTradable: ( description ) ->
    tradable = null

    if description?.tradable?
      switch description.tradable
        when 0
          tradable = CHOICE_NOTTRADABLE
        when 1
          tradable = CHOICE_TRADABLE

    if tradable?
      tag =
        category_name: OPTION_TRADABLE
        name: tradable
      @insert description, tag

  tagCommonMarketable: ( description ) ->
    marketable = null

    if description?.marketable?
      switch description.marketable
        when 0
          marketable = CHOICE_NOTMARKETABLE
        when 1
          marketable = CHOICE_MARKETABLE

    if marketable?
      tag =
        _tooltip: false
        category_name: OPTION_MARKETABLE
        name: marketable
      @insert description, tag

  tagCommonChangedName: ( description ) ->
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

    if renamed?
      tag =
        _tooltip: false
        category_name: OPTION_CHANGED_NAME
        name: renamed
      @insert description, tag

  tagCommonNameTag: ( description ) ->
    renamed = null

    if @isHaveFraudWarnings description
      _.each description.fraudwarnings, ( fraudwarning ) =>
        if not renamed?
          renamed = fraudwarning.match REGEX_NAMETAG
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

    if renamed?
      tag =
        _tooltip: false
        category_name: OPTION_CHANGED_NAME
        name: renamed
      @insert description, tag

  tagCommonChangedDescripion: ( description ) ->
    renamed = null

    if @isHaveDescriptions description
      _.each description.descriptions, ( definition ) =>
        if definition?.value?
          if not renamed?
            renamed = definition.value.match REGEX_RENAMED
            if renamed?
              tag =
                _filter: false
                category_name: OPTION_CHANGED_DESCRIPTION
                name: definition.value
              @insert description, tag

    if renamed?
      renamed = CHOICE_CHANGED_DESCRIPTION
    else
      renamed = CHOICE_NOTCHANGED_DESCRIPTION

    if renamed?
      tag =
        _tooltip: false
        category_name: OPTION_CHANGED_DESCRIPTION
        name: renamed
      @insert description, tag

  tagCommonGifted: ( description ) ->
    gifted = null

    if @isHaveDescriptions description
      _.each description.descriptions, ( definition ) =>
        if definition?.value?
          if not gifted?
            gifted = definition.value.match REGEX_GIFTED
            if gifted?
              tag =
                _filter: false
                category_name: OPTION_GIFTED_FROM
                name: gifted[ 1 ]
              @insert description, tag

    if gifted?
      gifted = CHOICE_GIFTED
    else
      gifted = CHOICE_NOTGIFTED

    if gifted?
      tag =
        _tooltip: false
        category_name: OPTION_GIFTED
        name: gifted
      @insert description, tag

  tagCommonCrafted: ( description ) ->
    crafted = null

    if @isHaveDescriptions description
      _.each description.descriptions, ( definition ) =>
        if definition?.value? and definition.color is COLOR_OPTION_CRAFTED
          if not crafted?
            crafted = definition.value.match REGEX_CRAFTED
            if crafted?
              tag =
                _filter: false
                category_name: OPTION_CRAFTED_BY
                name: crafted[ 1 ]
              @insert description, tag

    if crafted?
      crafted = CHOICE_CRAFTED
    else
      crafted = CHOICE_NOTCRAFTED

    if crafted?
      tag =
        _tooltip: false
        category_name: CHOICE_CRAFTED
        name: crafted
      @insert description, tag

  tagCommonClean: ( description ) ->
    clean = null

    if description?._sisbftags?
      tags = _.flatMap description._sisbftags, 'name'
      intersection = _.sortBy _.intersection tags, @cleanDefinition
      clean = _.isEqual @cleanDefinition, intersection

    if clean? and clean
      clean = CHOICE_CLEAN
    else
      clean = CHOICE_DIRTY

    if clean?
      tag =
        category_name: OPTION_CLEAN
        name: clean
      @insert description, tag

  tagCommonDescItemSetName: ( description ) ->
    if @isHaveDescriptions description
      _.each description.descriptions, ( definition ) =>
        if definition?.app_data?.is_itemset_name is 1
          tag =
            category_name: OPTION_ITEMSET
            name: definition.value
          @insert description, tag

  tagCommonDescStyle: ( description ) ->
    config =
      regex: REGEX_STYLE
      option: OPTION_STYLE
    @tagDesc description, config

  tagCommonDescDedication:  ( description ) ->
    config =
      regex: REGEX_DEDICATION
      option: OPTION_DEDICATION
    @tagDesc description, config

  constructor: () ->
    @_cleanDefinition()
    return super
