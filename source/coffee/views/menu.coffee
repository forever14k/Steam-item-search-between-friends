class MenuView extends BaseView

  el: '#sisbf_menu .sisbf_container .sisbf_menu'
  elAppendTo: '.friends_content'

  _el:
    load: '#sisbf_load'
    text: '#sisbf_text'
    search: '#sisbf_search'
    appid: '#sisbf_appid'
    contextid: '#sisbf_contextid'
    settings: '#sisbf_appid, #sisbf_contextid'

  delegateEvents: () ->
    @$_el.load
      .on 'click', @onLoadInventories.bind @
    @$_el.search
      .on 'click', @onSearchSelected.bind @
    @$_el.settings
      .on 'change', @onSettingsChanged.bind @
    @$_el.text
      .on 'keyup', @onSearchChange.bind @

  onStateChange: () ->
    @update()

  onSettingsChanged: ( event ) ->
    appid = @$_el.appid.val()
    contextid = @$_el.contextid.val()

    @state.dispatch
      type: SETTINGS_CHANGED
      appid: appid
      contextid: contextid

  onLoadInventories: ( event ) ->
    switch @state.getState().Persons.state
      when PERSONSCLUB_IDLE
        @state.dispatch
          type: PERSONSCLUB_QUEUE
      when PERSONSCLUB_QUEUE, PERSONSCLUB_RESUME, PERSONSCLUB_PROCESS
        @state.dispatch
          type: PERSONSCLUB_PAUSE
      when PERSONSCLUB_PAUSE
        @state.dispatch
          type: PERSONSCLUB_RESUME

  onSearchSelected: ( event ) ->
    state = @state.getState()
    search = state.Settings.search
    filters = state.Filters

    @state.dispatch
      type: BACKPACKS_SEARCH
      search: search
      filters: filters

  onSearchChange: ( event ) ->
    search = @$_el.text.val()

    @state.dispatch
      type: SEARCH_CHANGED
      search: search

  reset: () ->
    @$el.remove()

    if @shouldInitiate()
      @append()
      @render()
      @updateSelectors()

      @state.dispatch
        type: SETTINGS_CHANGED

  append: () ->
    $( @elAppendTo ).prepend sisbf.menu_container @state.getState()
    @updateSelectors()

  render: () ->
    @$el.html sisbf.menu_menu @state.getState()
    @updateSelectors()
    @delegateEvents()

  update: () ->
    if @$el.length isnt 0
      render.diff @$el, sisbf.menu_menu( @state.getState() )

  constructor: () ->
    super
    if @shouldInitiate()
      @append()
      @render()
