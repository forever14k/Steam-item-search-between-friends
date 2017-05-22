StateReducers = Redux.combineReducers
  # Debug: new DebugReducer
  Adaptation: new AdaptationReducer
  Settings: new MenuReducer
  Persons: new PersonsReducer
  Tags: Redux.combineReducers
    Common: new TagsCommonReducer
    TF2: new TagsTF2Reducer
    DOTA2: new TagsDOTA2Reducer
    CSGO: new TagsCSGOReducer
  Backpacks: new BackpacksReducer
  Filters: new FiltersReducer

State = Redux.createStore StateReducers

if State.getState().Debug
  State.subscribe () ->
    console.log 'STATE', State.getState()
