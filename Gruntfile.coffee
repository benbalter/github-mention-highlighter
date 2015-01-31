module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        options:
          sourceMap: true
        files:
          'dist/script.js': 'src/script.coffee'
    watch:
      scripts:
        files: [ 'src/*.coffee' ]
        tasks: 'coffee'
      styles:
        files: [ 'src/*.scss' ]
        tasks: 'sass'
    sass:
      dist:
        options:
          style: "compressed"
        files:
          'dist/style.css': 'src/style.scss'

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-sass'

  grunt.registerTask 'build', ['coffee', 'sass']
  grunt.registerTask 'default', ['build']
