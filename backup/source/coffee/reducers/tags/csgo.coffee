class TagsCSGOReducer extends TagsBaseReducer

  initialState:
    appId: APPID_CSGO

  middlewares: [
    'tagCSGODescStickers'
  ]

  tagCSGODescStickers: ( description ) ->
    if @isHaveDescriptions description
      stickers = null
      _.each description.descriptions, ( definition ) =>
        stickers = definition.value.match REGEX_STICKERS

        if stickers?
          stickers = stickers[ 1 ].split ', '
          _.each stickers, ( sticker ) =>
            tag =
              category_name: OPTION_STICKER
              name: sticker
            @insert description, tag
