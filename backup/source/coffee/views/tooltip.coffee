class TooltipView extends BaseView

  el: '.sisbf_tooltip'
  elAppendTo: 'body'

  _el:
    items: '.sisbf_backpacks-items [data-descriptionid]'

  delegateEvents: () ->
    $ document
      .on 'mouseover', @_el.items, @onMouseOver.bind @
      .on 'mouseout', @_el.items, @onMouseOut.bind @

  onMouseOver: ( event ) ->
    @update event, () =>
      @show event

  onMouseOut: () ->
    @hide event

  show: ( event ) ->
    $target = $ event.target
    position = $target.position()
    width = @$el.outerWidth()

    @$el.css
      top: position.top - 8

    if (width + position.left + 100) >= $(window).width()
      @$el.css
        left: position.left - width
    else
      @$el.css
        left: position.left + 82

  hide: ( event ) ->
    @$el.css
      top: -1000
      left: -1000

  process: ( tooltip, tag ) ->
    disclosed = if tag._tooltip? then tag._tooltip else true
    if disclosed
      tooltip.tooltip[ tag.category_name ] = [] if not tooltip.tooltip[ tag.category_name ]?
      tooltip.tooltip[ tag.category_name ].push
        name: tag.name
        color: if tag.color? then tag.color else null

  build: ( description ) ->
    tooltip =
      description: description
      tooltip: {}

    tooltip.tooltip[ OPTION_NAME ] =
      name: description.market_name

    if description?.tags?
      _.each description.tags, ( tag ) =>
        @process tooltip, tag

    if description?._sisbftags?
      _.each description._sisbftags, ( tag ) =>
        @process tooltip, tag

    return tooltip

  append: () ->
    $( @elAppendTo ).append sisbf.tooltip_container @state.getState()
    @updateSelectors()

  render: () ->
    @$el.html sisbf.tooltip_tooltip @state.getState()
    @delegateEvents()

  update: ( event, callback ) ->
    $target = $ event.target
    state = @state.getState().Backpacks.descriptions

    descriptionId = $target.attr 'data-descriptionid'
    description = state[ descriptionId ]
    if description?
      @$el.html sisbf.tooltip_tooltip @build description
      callback()

  constructor: () ->
    super
    @append()
    @render()
