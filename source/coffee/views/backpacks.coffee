class BackpacksView extends BaseView

  el: '#sisbf_backpacks .sisbf_container .sisbf_backpacks'
  elAppendTo: '.friends_content'

  _el:
    users: '.sisbf_backpacks-user'

  onStateChange: () ->
    state = @state.getState().Backpacks
    if state.state is BACKPACKS_NOTDISPLAYED
      @render()
      @update()

  addSteamProfile: ( user ) ->
    $user = $ user
    steamId32 = $user.attr 'data-steamid32'
    $profile = $ "[data-miniprofile=#{steamId32}]"
    $profile
      .first()
      .clone()
      .appendTo $user

  reset: () ->
    @$el.remove()

    if @shouldInitiate()
      @append()
      @render()
      @updateSelectors()

  update: () ->
    @updateSelectors()
    _.each @$_el.users, @addSteamProfile.bind @

  append: () ->
    $( @elAppendTo ).prepend sisbf.backpacks_container @state.getState()
    @updateSelectors()

  render: () ->
    @$el.html sisbf.backpacks_backpacks @state.getState()

    @state.dispatch
      type: BACKPACKS_DISPLAYED

  constructor: () ->
    super
    if @shouldInitiate()
      @append()
      @render()
