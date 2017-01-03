class PersonsView extends BaseView

  el: '.profile_friends [data-miniprofile]'

  onStateChange: () ->
    state = @state.getState().Persons.state
    if state is PERSONSCLUB_OUTDATED
      @reset()
    else
      @update()

  reset: () ->
    @updateSelectors()
    persons = []
    _.each @$el, ( person ) =>
      $person = $ person
      steamId32 = $person.attr 'data-miniprofile'
      steamId64 = Steam::toSteamId64 steamId32
      status = STATUS_UNKNOWN
      status = STATUS_OFFLINE if $person.hasClass 'offline'
      status = STATUS_INGAME if $person.hasClass 'in-game'
      status = STATUS_ONLINE if $person.hasClass 'online'
      persons.push
        steamId32: steamId32
        steamId64: steamId64
        state: PERSON_IDLE
        status: status

    @state.dispatch
      type: PERSONSCLUB_ADD
      persons: persons

  update: () ->
    persons = @state.getState().Persons.persons
    _.each persons, ( person, index ) =>
      $person = @$el.filter("[data-miniprofile=#{person.steamId32}]")
      $person
        .removeClass 'sisbf_person--queue sisbf_person--loading sisbf_person--error sisbf_person--empty sisbf_person--busy'
      switch person.state
        when PERSON_QUEUE
          $person
            .addClass 'sisbf_person--queue'
        when PERSON_LOADING
          $person
            .addClass 'sisbf_person--loading'
        when PERSON_ERROR
          $person
            .addClass 'sisbf_person--error'
        # when PERSON_IDLE, PERSON_LOADED, PERSON_EMPTY, PERSON_BUSY
        #   # nothing
