class AdaptationReducer

  initialState: true

  adapt: ( state, action ) ->
    if action?.backpack?.assets? and action?.backpack?.descriptions?
      backpack = action.backpack

      backpack.success = backpack?.success is 1

      backpack.rgInventory = {}
      _.each backpack.assets, ( asset, assetIndex ) =>
        asset.id = asset.assetid if asset?.assetid?
        backpack.rgInventory[ asset.id ] = asset

      backpack.rgDescriptions = {}
      _.each backpack.descriptions, ( description, descriptionIndex ) =>
        description.appid = description.appid.toString() if description?.appid?
        _.each description.tags, ( tag, tagIndex ) =>
          tag.name = tag.localized_tag_name if tag?.localized_tag_name?
          tag.category_name = tag.localized_category_name if tag?.localized_category_name?
        backpack.rgDescriptions[ "#{description.classid}_#{description.instanceid}" ] = description

    return state

  reducer: ( state = @initialState, action ) ->
    switch action.type
      when PERSON_LOADED
        @adapt state, action
    return state

  constructor: () ->
    return @reducer.bind @
