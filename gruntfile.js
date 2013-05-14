module.exports = function(grunt) {

  grunt.initConfig({
    jasmine_node: {
      specNameMatcher: ".", // load only specs containing specNameMatcher
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    },
    jshint: {
      files: ["./*.js", "src/**/*.js", "spec/**/*.js"],
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        immed:true,
        eqnull: true,
        indent:2,
        newcap:true,
        quotmark:"double",
        undef:true,
        unused:true,
        browser: true,
        maxlen:80,
        node:true,
        globals:{
          describe:false,
          it:false,
          expect:false
        }
      },
      uses_defaults: ["dir1/**/*.js", "dir2/**/*.js"],
      with_overrides: {
        options: {
          curly: false,
          undef: true
        }
        
      }
    }
  });

  grunt.loadNpmTasks("grunt-jasmine-node");
  grunt.loadNpmTasks("grunt-contrib-jshint");


  grunt.registerTask("test", ["jshint","jasmine_node"]);

};