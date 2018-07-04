hook__PageControllerInstrumentLinks = () ->
  if window.g_PageController?.InstrumentLinks?
    window.hooked__PageControllerInstrumentLinks = window.g_PageController.InstrumentLinks
    window.g_PageController.InstrumentLinks = ( ) ->
      window.hooked__PageControllerInstrumentLinks arguments...

      message =
        PageControllerInstrumentLinks: true
      window.postMessage message, '*'

new injectHook hook__PageControllerInstrumentLinks
