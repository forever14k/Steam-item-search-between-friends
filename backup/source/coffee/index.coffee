queue = new Queue State
render = new Render State

tooltip = new TooltipView State
backpacks = new BackpacksView State
filters = new FiltersView State
menu = new MenuView State
persons = new PersonsView State

State.dispatch
  type: 'STATE_INIT'
