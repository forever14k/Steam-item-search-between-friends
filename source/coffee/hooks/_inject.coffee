class injectHook
  hook = null
  script = null

  create: () ->
    if @hook?
      @script = document.createElement 'script'

      @script
        .setAttribute 'type', 'text/javascript'

      @script
        .innerHTML = "(#{@hook})()"

  inject: () ->
    if @script?
      document
        .querySelector 'head'
        .appendChild @script

  constructor: ( hook ) ->
    @hook = hook.toString() if hook?.toString?
    @create()
    @inject()
