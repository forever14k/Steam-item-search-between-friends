class TagsTF2Reducer extends TagsBaseReducer

  initialState:
    appId: APPID_TF2

  middlewares: [
    'tagTF2TypeLevel'
    'tagTF2TypeLimited'
    'tagTF2TypeStrange'
    'tagTF2DescStrangeKills'
    'tagTF2DescStrange'
    'tagTF2DescPaint'
    'tagTF2DescHalloween'
    'tagTF2DescHoliday'
    'tagTF2DescEffectKillstreaker'
    'tagTF2DescEffectSheen'
    'tagTF2DescEffectUnusual'
    'tagTF2DescMedal'
  ]

  tagTF2TypeLevel: ( description ) ->
    level = null

    if description?.type?
      level = description.type.match REGEX_LEVEL
      if level?
        level = level[ 1 ]

    if level?
      tag =
        category_name: OPTION_LEVEL
        name: level
      @insert description, tag

  tagTF2TypeLimited: ( description ) ->
    limited = null
    color = null

    if description?.type?
      limited = description.type.match REGEX_TYPE_LIMITED
      if limited?
        limited = CHOICE_LIMITED

    color = description.name_color if description?.name_color?

    if limited?
      tag =
        category_name: OPTION_QUALITY
        name: limited
        color: color
      @insert description, tag

  tagTF2TypeStrange: ( description ) ->
    strange = null

    if description?.type?
      strange = description.type.match REGEX_TYPE_STRANGE
      if strange?
        strange = strange[ 1 ]

    if strange?
      tag =
        category_name: OPTION_TRACK
        name: strange
      @insert description, tag

  tagTF2DescStrangeKills: ( description ) ->
    config =
      regex: REGEX_STRANGE_KILLS
      option: OPTION_TRACK
      value: CHOICE_KILLS
    @tagDesc description, config

  tagTF2DescStrange: ( description ) ->
    config =
      regex: REGEX_STRANGE
      option: OPTION_TRACK
    @tagDesc description, config

  tagTF2DescPaint: ( description ) ->
    config =
      regex: REGEX_PAINT
      option: OPTION_PAINT
    @tagDesc description, config

  tagTF2DescHalloween: ( description ) ->
    config =
      regex: REGEX_HALLOWEEN
      option: OPTION_HALLOWEEN
    @tagDesc description, config

  tagTF2DescHoliday: ( description ) ->
    config =
      regex: REGEX_HOLIDAY
      option: OPTION_HOLIDAY
    @tagDesc description, config

  tagTF2DescEffectKillstreaker: ( description ) ->
    config =
      regex: REGEX_KILLSTREAKER
      option: OPTION_EFFECT
    @tagDesc description, config

  tagTF2DescEffectSheen: ( description ) ->
    config =
      regex: REGEX_SHEEN
      option: OPTION_EFFECT
    @tagDesc description, config

  tagTF2DescEffectUnusual: ( description ) ->
    config =
      regex: REGEX_UNUSUAL
      option: OPTION_EFFECT
    @tagDesc description, config

  tagTF2DescMedal: ( description ) ->
    config =
      regex: REGEX_MEDAL
      option: OPTION_MEDAL
    @tagDesc description, config
