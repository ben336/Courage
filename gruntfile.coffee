module.exports = (grunt) ->
  grunt.initConfig (
    "jasmine-node":
      options:
        coffee: true
      run:
        spec: "spec"
      env:
        NODE_PATH: undefined
    coffeelint:
      app: ["./*.coffee", "src/**/*.coffee"]
      tests:
        files:
          src: ["spec/**/*.coffee"]
        options:
          indentation:
            value: 2
    docco:
      debug:
        src: ["./*.coffee", "src/**/*.coffee"],
        options:
          output: "docs/"
    jshint:
      files: ["./*.js", "src/**/*.js", "spec/**/*.js"]
      options:
        bitwise: true
        curly: true
        eqeqeq: true
        immed: true
        eqnull:  true
        indent: 2
        newcap: true
        quotmark: "double"
        undef: true
        unused: true
        browser:  true
        maxlen: 80
        node: true
        globals:
          describe: false
          it: false
          expect: false
          runs: false
          waitsFor: false
      uses_defaults: ["dir1/**/*.js", "dir2/**/*.js"]
      with_overrides:
        options:
          curly: false
          undef: true
  )
  grunt.loadNpmTasks "grunt-contrib-jasmine-node"
  grunt.loadNpmTasks "grunt-contrib-jshint"
  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-docco"

  grunt.registerTask "docs", ["docco"]
  grunt.registerTask "test", ["coffeelint","jasmine-node","jshint"]
