class BaseView

  el: ''
  $el: null

  _el: {}
  $_el: {}

  state: null

  $: ( selector ) ->
    return @$el.find selector

  subscribe: () ->
    @state.subscribe @onStateChange.bind @

  delegateWindowEvents: () ->
    $ window
      .on 'message', @onWindowMessage.bind @

  onWindowMessage: ( event ) ->
    if event?.originalEvent?.data?.PageControllerInstrumentLinks? and @reset
      @reset()

  onStateChange: _.noop

  shouldInitiate: () ->
    path = location.pathname.split('/')
    lastItem = path.pop()
    lastItem = path.pop() if lastItem is ''
    return lastItem is 'friends' or lastItem is 'blocked' or lastItem is 'following'

  updateSelectors: () ->
    @$el = $ @el
    _.each @_el, ( element, name ) =>
      @$_el[ name ] = @$ element

  constructor: ( @state ) ->
    @subscribe()
    @updateSelectors()
    @delegateWindowEvents()
