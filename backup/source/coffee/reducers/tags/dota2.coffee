class TagsDOTA2Reducer extends TagsBaseReducer

  initialState:
    appId: APPID_DOTA2

  middlewares: [
    'tagDOTA2DescEvent'
    'tagDOTA2DescHeroicVictory'
    'tagDOTA2DescHeroicFirstBlood'
    'tagDOTA2DescHeroicDoubleKill'
    'tagDOTA2DescHeroicTripleKill'
    'tagDOTA2DescHeroicUltraKill'
    'tagDOTA2DescHeroicRampage'
    'tagDOTA2DescHeroicGodlike'
    'tagDOTA2DescHeroicCourierKill'
    'tagDOTA2DescHeroicAllyDenied'
    'tagDOTA2DescHeroicAegisDenied'
    'tagDOTA2DescHeroicAegisSnatch'
    'tagDOTA2DescHeroicEarlyRoshan'
    'tagDOTA2DescHeroicRapier'
    'tagDOTA2DescHeroic5EchoSlam'
    'tagDOTA2DescPlayerCardPlayer'
    'tagDOTA2DescPlayerCardTeam'
    'tagDOTA2DescGems'
  ]

  tagDOTA2DescEvent:  ( description ) ->
    config =
      regex: REGEX_EVENT_DOTA2
      option: OPTION_EVENT
    @tagDesc description, config

  tagDOTA2DescHeroicVictory: ( description ) ->
    config =
      regex: REGEX_HEROIC_VICTORY
      option: OPTION_HEROIC
      value: CHOICE_VICTORY
      order: [ OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicFirstBlood: ( description ) ->
    config =
      regex: REGEX_HEROIC_FIRSTBLOOD
      option: OPTION_HEROIC
      value: CHOICE_FIRSTBLOOD
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicDoubleKill: ( description ) ->
    config =
      regex: REGEX_HEROIC_DOUBLEKILL
      option: OPTION_HEROIC
      value: CHOICE_DOUBLEKILL
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicTripleKill: ( description ) ->
    config =
      regex: REGEX_HEROIC_TRIPLEKILL
      option: OPTION_HEROIC
      value: CHOICE_TRIPLEKILL
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicUltraKill: ( description ) ->
    config =
      regex: REGEX_HEROIC_ULKTRAKILL
      option: OPTION_HEROIC
      value: CHOICE_ULTRAKILL
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicRampage: ( description ) ->
    config =
      regex: REGEX_HEROIC_RAPMAGE
      option: OPTION_HEROIC
      value: CHOICE_RAMPAGE
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicGodlike: ( description ) ->
    config =
      regex: REGEX_HEROIC_GODLIKE
      option: OPTION_HEROIC
      value: CHOICE_GODLIKE
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicCourierKill: ( description ) ->
    config =
      regex: REGEX_HEROIC_COURIERKILL
      option: OPTION_HEROIC
      value: CHOICE_COURIERKILL
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicAllyDenied: ( description ) ->
    config =
      regex: REGEX_HEROIC_ALLYDENIED
      option: OPTION_HEROIC
      value: CHOICE_ALLYDENIED
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_PLAYER ]
    @tagDesc description, config

  tagDOTA2DescHeroicAegisDenied: ( description ) ->
    config =
      regex: REGEX_HEROIC_AEGISDENIED
      option: OPTION_HEROIC
      value: CHOICE_AEGISDENIED
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicAegisSnatch: ( description ) ->
    config =
      regex: REGEX_HEROIC_AEGISSNATCH
      option: OPTION_HEROIC
      value: CHOICE_AEGISSNATCH
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicEarlyRoshan: ( description ) ->
    config =
      regex: REGEX_HEROIC_EARLYROSHAN
      option: OPTION_HEROIC
      value: CHOICE_EARLYROSHAN
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroicRapier: ( description ) ->
    config =
      regex: REGEX_HEROIC_RAPIER
      option: OPTION_HEROIC
      value: CHOICE_RAPIER
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescHeroic5EchoSlam: ( description ) ->
    config =
      regex: REGEX_HEROIC_5ECHOSLAM
      option: OPTION_HEROIC
      value: CHOICE_5ECHOSLAM
      order: [ OPTION_PLAYER, OPTION_TEAM, OPTION_TEAM ]
    @tagDesc description, config

  tagDOTA2DescPlayerCardPlayer: ( description ) ->
    name = null
    player = null
    nickname = null

    if description?.market_name?
      nickname = description.market_name.match REGEX_NICKNAME_DOTA2

    if @isHaveDescriptions description
      _.each description.descriptions, ( definition ) =>
        if definition?.value?
          if not name?
            name = definition.value.match REGEX_PLAYER_DOTA2

    player = null
    if name?
      if nickname?
        player = "#{nickname[ 1 ]} (#{name[ 1 ]})"
      else
        player = "#{name[ 1 ]}"

    if player?
      tag =
        category_name: OPTION_PLAYER
        name: player
      @insert description, tag

  tagDOTA2DescPlayerCardTeam: ( description ) ->
    config =
      regex: REGEX_TEAM_DOTA2
      option: OPTION_TEAM
    @tagDesc description, config

  tagDOTA2DescGem: ( description, gem ) ->
    tag = null
    name = null
    value = null
    autograph = null

    if gem[ 2 ]?
      name = gem[ 2 ].match REGEX_TRACK

    if gem[ 1 ]?
      value = gem[ 1 ].match REGEX_TRACK

    if not name? and not value?
      autograph = gem[ 2 ].match REGEX_AUTOGRAPHRUNE
      if autograph?
        autograph = gem[ 1 ].match REGEX_AUTOGRAPHED

    if autograph?
      tag =
        category_name: OPTION_AUTOGRAPHRUNE
        name: autograph[ 2 ]
    else
      if name?
        tag =
          category_name: OPTION_TRACK
          name: "#{name[ 1 ]} (#{ gem[ 1 ]})"
      else if value?
        tag =
          category_name: OPTION_TRACK
          name: value[ 1 ]
      else
        tag =
          category_name: gem[ 2 ]
          name: gem[ 1 ]

    if tag?
      @insert description, tag


  tagDOTA2DescGems: ( description ) ->
    gems = null

    if @isHaveDescriptions description
      _.each description.descriptions, ( definition ) =>
        gems = definition.value.match REGEX_GEMS

        if gems?
          _.each gems, ( gemString ) =>
            gem = gemString.match REGEX_GEM

            if gem?
              @tagDOTA2DescGem description, gem
