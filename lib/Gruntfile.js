module.exports = function(grunt) {

  grunt.initConfig({
    // Change the b-fy task to add a transform task
    browserify: {
      js: {
          src: ['../javascripts/main.js'],
          dest: '../dist/app.js'
      },
      options: {
          transform: ['hbsfy'],
          browserifyOptions: {
            paths: ["./node_modules"]
          }
      }
    },
    jshint: {
      options: {
        predef: [ "document", "console"],
        esnext: true,
        strict: "global",
        globals: {},
        browserify: true
      },
      files: ['../javascripts/**/*.js']
    },
    sass: {
      dist: {
        files: {
          '../css/styles.css': '../sass/main.scss'
        }
      }
    },
    watch: {
      javascripts: {
        files: ['../javascripts/**/*.js'],
        tasks: ['jshint', 'browserify']
      },
      sass: {
        files: ['../sass/**/*.scss'],
        tasks: ['sass']
      },
      hbs: {
        files: ['../templates/**/*.hbs'],
        tasks: ['browserify']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['jshint', 'sass', 'browserify', 'watch']);
};
