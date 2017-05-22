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

  onStateChange: _.noop
  onWindowMessage: _.noop

  updateSelectors: () ->
    @$el = $ @el
    _.each @_el, ( element, name ) =>
      @$_el[ name ] = @$ element

  constructor: ( @state ) ->
    @subscribe()
    @updateSelectors()
    @delegateWindowEvents()
