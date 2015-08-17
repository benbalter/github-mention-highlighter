module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    coffee:
      compile:
        options:
          sourceMap: true
        files:
          'dist/script.js': 'src/script.coffee'
          'dist/options.js': 'src/options.coffee'
    watch:
      scripts:
        files: [ 'src/*.coffee' ]
        tasks: 'coffee'
      styles:
        files: [ 'src/*.scss' ]
        tasks: 'sass'
      htmls:
        files: [ 'src/*.html' ]
        tasks: 'copy'
    sass:
      dist:
        options:
          style: "compressed"
        files:
          'dist/style.css': 'src/style.scss'
    copy:
      main:
        expand: true
        cwd: "src/"
        src: "*.html"
        dest: "dist/"

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-copy'

  grunt.registerTask 'build', ['coffee', 'sass', 'copy']
  grunt.registerTask 'default', ['build']
