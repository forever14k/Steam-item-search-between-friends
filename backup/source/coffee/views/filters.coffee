class FiltersView extends BaseView

  el: '#sisbf_filters .sisbf_container .sisbf_filters'
  elAppendTo: '.maincontent'

  onStateChange: () ->
    @update()

  onQuery: ( query ) ->
    option = query.element.attr 'data-option-current'
    state = @state.getState().Filters[ option ]
    data =
      results: []
    if query.term?
      term = query.term.toLowerCase()
      _.each state.options, ( choice, index ) =>
        search = choice.name.toLowerCase()
        selected = _.flatMap state.selected, ( selection ) ->
          return selection.name.toLowerCase()
        if not _.includes selected, search
          if _.includes search, term
            data.results.push id: choice.name, text: choice.name, color: choice.color
      # tf2 levels
      if option is OPTION_LEVEL
        data.results = data.results.sort ( a, b ) -> a.text - b.text # integer sort

    query.callback data

  onChange: ( event ) ->
    if event.added? and event.removed?
      @onReplaced event
    else
      if event.added?
        @onAdded event
      if event.removed?
        @onRemoved event

  onAdded: ( event ) ->
    $target = $ event.target

    option = $target.attr 'data-option-current'
    added = event.added.id

    @state.dispatch
      type: FILTERS_SELECTED
      option: option
      added:
        name: added

  onRemoved: ( event ) ->
    $target = $ event.target

    option = $target.attr 'data-option-current'
    removed = event.removed.id

    $target
      .select2 'destroy'
      .parent()
      .parent()
      .remove()

    @state.dispatch
      type: FILTERS_REMOVED
      option: option
      removed:
        name: removed

  onReplaced: ( event ) ->
    $target = $ event.target

    option = $target.attr 'data-option-current'
    added = event.added.id
    removed = event.removed.id

    @state.dispatch
      type: FILTERS_REPLACED
      option: option
      added:
        name: added
      removed:
        name: removed

  onFormatResult: ( item ) ->
    return sisbf.filters_results item

  onFormatSelection: ( item ) ->
    return sisbf.filters_selection item

  append: () ->
    $( @elAppendTo ).prepend sisbf.filters_container @state.getState()
    @updateSelectors()

  prepare: () ->
    state = @state.getState().Filters
    _.each state, ( filter, option ) =>
      $option = @$el.find("[data-options='#{option}']")
      if filter.enabled
        if $option.length < 1
          @$el.append sisbf.filters_filters option: option
      else
        if $option.length > 0
          $option.remove()

  insert: () ->
    state = @state.getState().Filters
    _.each state, ( filter, option ) =>
      $options = @$el.find("[data-option='#{option}']")
      if $options.length is filter.selected.length
        @insertSelect option, filter

  insertSelect: ( option, filter ) ->
    $option = $ sisbf.filters_option
      option: option
      filter: filter
    $option
      .find 'input'
      .select2
        allowClear: true
        placeholder: 'Any'
        query: @onQuery.bind @
        formatResult: @onFormatResult.bind @
        formatSelection: @onFormatSelection.bind @
      .on 'change', @onChange.bind @

    @$el.find "[data-options='#{option}']"
      .append $option

  update: () ->
    @prepare()
    @insert()

  constructor: () ->
    super
    @append()
