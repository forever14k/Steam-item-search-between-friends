# Karma configuration
# Generated on Wed Sep 28 2016 23:18:23 GMT+0300 (RTZ 2 (зима))

module.exports = (config) ->
  config.set
    basePath: ''
    frameworks: [ 'jasmine-ajax', 'jasmine' ]
    files: [
      'node_modules/jquery/dist/jquery.min.js'
      'node_modules/jquery.cookie/jquery.cookie.js'
      'node_modules/biginteger/biginteger.js'
      'node_modules/lodash/lodash.min.js'
      'node_modules/jade/runtime.js'
      'node_modules/redux/dist/redux.min.js'
      'node_modules/async/dist/async.js'
      'node_modules/diff-dom/diffDOM.js'
      'node_modules/select2/select2.min.js'
      'source/coffee/types/*.coffee'
      'source/coffee/views/*.coffee'
      'source/coffee/actions/*.coffee'
      'source/coffee/reducers/**/*.coffee'
      'tests/mocks/__mock__.coffee'
      'tests/mocks/**/*.json'
      'tests/**/*.coffee'
    ]
    exclude: []
    preprocessors:
      '**/*.coffee': [ 'coffee' ]
      'tests/mocks/**/*.json': [ 'json_fixtures' ]
    jsonFixturesPreprocessor:
      stripPrefix: 'tests/mocks/'
      variableName: '___mock___'
    reporters: [ 'verbose', 'kjhtml' ]
    port: 9876
    colors: true
    logLevel: config.LOG_INFO
    autoWatch: true
    usePolling: true
    browsers: [
      'Chrome'
      # 'CromeWithoutSecurity'
      # 'PhantomJS'
    ]
    customLaunchers:
      'CromeWithoutSecurity':
        base: 'Chrome'
        flags: [ '--disable-web-security' ]
    singleRun: false
    concurrency: Infinity
