class Render

  diffDOM: null

  diff: ( $element, newHTML ) ->
    oldEl = $element.find '.sisbf_render--diff'
    newEl = $ newHTML
    newEl = newEl.find '.sisbf_render--diff' if not newEl.hasClass 'sisbf_render--diff'

    oldDOM = _.first oldEl
    newDOM = _.first newEl
    midDOM = @diffDOM.diff oldDOM, newDOM
    @diffDOM.apply oldDOM, midDOM

  preDiffApply: ( info ) ->
      if info?.node?.classList?
          return info.node.classList.contains( 'sisbf_render--oneway' ) and info.diff.action is 'modifyValue'
      return false

  constructor: ( @state ) ->
    @diffDOM = new diffDOM
        preDiffApply: @preDiffApply.bind @
