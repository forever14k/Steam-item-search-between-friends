class MenuReducer

  initialState:
    appid: '570'
    contextid: '2'
    search: ''
    cookie: 'strInventoryLastContext'

  setCookie: ( state ) ->
    $.cookie state.cookie, "#{state.appid}_#{state.contextid}", { expires: 7, path: '/' }
    return state

  getCookie: ( state ) ->
    cookie = $.cookie state.cookie
    if cookie?
      cookie = cookie.split '_'
      state.appid = cookie.shift()
      state.contextid = cookie.shift()
    return state

  checkCookie: ( state ) ->
    @getCookie state
    @setCookie state
    return state

  appid: ( state, action ) ->
    state.appid = action.appid if action.appid?
    return state

  contextid: ( state, action ) ->
    state.contextid = action.contextid if action.contextid?
    return state

  search: ( state, action ) ->
    state.search = action.search if action.search?
    return state

  reducer: ( state = @initialState, action ) ->
    switch action.type
      when REDUX_INIT
        @checkCookie state
      when SETTINGS_CHANGED
        @appid state, action
        @contextid state, action
        @setCookie state
      when APPID_CHANGED
        @appid state, action
        @setCookie state
      when CONTEXTID_CHANGED
        @contextid state, action
        @setCookie state
      when SEARCH_CHANGED
        @search state, action
    return state

  constructor: () ->
    return @reducer.bind @
