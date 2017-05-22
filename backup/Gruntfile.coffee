module.exports = (grunt)->

  glob = require 'glob'

  grunt.initConfig
    bump:
      options:
        push: false
        commit: false
        createTag: false
        files: [
          'package.json'
          'manifest.json'
        ]
    clean:
      options:
        force: true
      app: [
        "build/*"
        "temp/*"
      ]
    mkdir:
      app:
        options:
          create: [
            'build'
            'temp'
          ]
    copy:
      temp:
        files:
          'temp/js/libs/jquery.js': 'node_modules/jquery/dist/jquery.min.js'
          'temp/js/libs/jquery.cookie.js': 'node_modules/jquery.cookie/jquery.cookie.js'
          'temp/js/libs/biginteger.js': 'node_modules/biginteger/biginteger.js'
          'temp/js/libs/lodash.js': 'node_modules/lodash/lodash.min.js'
          'temp/js/libs/jade.js': 'node_modules/jade/runtime.js'
          'temp/js/libs/redux.js': 'node_modules/redux/dist/redux.min.js'
          'temp/js/libs/async.js': 'node_modules/async/dist/async.js'
          'temp/js/libs/diffdom.js': 'node_modules/diff-dom/diffDOM.js'
          'temp/js/libs/select2.js': 'node_modules/select2/select2.min.js'
          'temp/css/libs/select2.css': 'node_modules/select2/select2.css'
      app:
        files:[
          { 'build/js/app.js': 'temp/js/app.min.js' }
          { 'build/css/app.css': 'temp/css/app.min.css' }
          { 'build/': 'static/**' }
          { 'build/manifest.json': 'manifest.json' }
        ]
      min:
        files:[
          'temp/css/app.min.css': 'temp/css/app.css'
          'temp/js/app.min.js': 'temp/js/app.js'
        ]
    coffee:
      app:
        options:
          bare: true
        files:[{
          expand: true
          cwd: "source/coffee/"
          src: ["**/*.coffee"]
          dest: "temp/js/scripts"
          ext: ".js"
        }]
    jade:
      app:
        options:
          amd: false
          client: true
          compileDebug: false
          namespace: 'sisbf'
          processName: ( name ) ->
            name
              .replace 'source/jade/', ''
              .replace '.jade', ''
              .replace '/', '_'
        files: [{
          expand: true
          cwd: 'source/jade/'
          src: [ "**/*.jade" ]
          dest: 'temp/js/templates'
          ext: ".js"
        }]
    dataUri:
      select2:
        src: 'temp/css/libs/select2.css'
        dest: 'temp/css/libs/'
        options:
          baseDir: 'node_modules/select2/'
          target: 'node_modules/select2/*.*'
    stylus:
      app:
        files: [{
          expand: true
          cwd: 'source/styl/'
          src: [ "**/*.styl" ]
          dest: 'temp/css/styles'
          ext: ".css"
        }]
    concat:
      app:
        files:
          'temp/css/app.css': [
            'temp/css/libs/*.css',
            'temp/css/styles/*.css'
            'temp/css/styles/**/*.css'
          ]
          'temp/js/app.js': [
            'temp/js/libs/jquery.js',
            'temp/js/libs/*.js',
            'temp/js/templates/*.js',
            'temp/js/templates/**/*.js',
            'temp/js/scripts/*.js'
            'temp/js/scripts/types/*.js'
            'temp/js/scripts/hooks/*.js'
            'temp/js/scripts/views/*.js'
            'temp/js/scripts/views/**/*.js'
            'temp/js/scripts/actions/*.js'
            'temp/js/scripts/reducers/**/*.js'
            '!temp/js/scripts/state.js', 'temp/js/scripts/state.js'
            '!temp/js/scripts/index.js', 'temp/js/scripts/index.js'
          ]
    cssmin:
      app:
        files:
          'temp/css/app.min.css': 'temp/css/app.css'
    uglify:
      app:
        files:
          'temp/js/app.min.js': 'temp/js/app.js'
    watch:
      app:
        files: [ 'source/**', 'static/**' ]
        tasks: [ 'build-dev' ]
    update_json:
      options:
        indent: '\t'
      app:
        src: 'build/manifest.json'
        dest: 'build/manifest.json'
        fields: [{
          web_accessible_resources: ( ) ->
            glob
              .sync('build/**/*.*')
              .map ( filepath ) ->
                filepath.replace 'build/', ''
              .filter ( filepath ) ->
                filepath isnt 'manifest.json'
        }]


  # dependencies
  grunt.loadNpmTasks 'grunt-bump'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-mkdir'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jade'
  grunt.loadNpmTasks 'grunt-contrib-stylus'
  grunt.loadNpmTasks 'grunt-data-uri'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-update-json'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # build
  grunt.registerTask 'prepare', [ 'clean', 'mkdir' ]
  grunt.registerTask 'compile', [ 'copy:temp', 'coffee', 'jade', 'stylus', 'dataUri', 'concat', 'cssmin', 'uglify' ]
  grunt.registerTask 'compile-dev', [ 'copy:temp', 'coffee', 'jade', 'stylus', 'dataUri', 'concat', 'copy:min' ]
  grunt.registerTask 'output', [ 'copy:app' , 'update_json' ]

  grunt.registerTask 'build', [ 'prepare', 'compile', 'output' ]
  grunt.registerTask 'build-dev', [ 'prepare', 'compile-dev', 'output' ]
  grunt.registerTask 'develop', [ 'build-dev', 'watch' ]

  # default
  grunt.registerTask 'default', [ 'build' ]

  # return
  return grunt
