
/*
# Grunt Config
This serves as the main configuration file for grunt.
It controls the different tasks.
Unfortunately, it also doesn't get along well with dox our documentation
engine, because dox doesn't handle comment like syntax in strings
very well, and chokes on it.
*/
module.exports = function(grunt) {
  grunt.initConfig({
    "jasmine-node": {
      options: {
        coffee: true,
        forceexit: true
      },
      run: {
        spec: "spec"
      },
      env: {
        NODE_PATH: void 0
      }
    },
    dox: {
      options: {
        title: "Courage documentation"
      },
      files: {
        ignore: ["views"],
        src: ["./*.js","src/**/*","spec/**/*.js","public/**/*.js"],
        dest: "docs"
      }
    },
    jshint: {
      files: ["./*.js","src/**/*.js","spec/**/*.js","public/js/*.js",
          "!public/js/lib/*"],
      options: {
        bitwise: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        eqnull: true,
        indent: 2,
        newcap: true,
        quotmark: "double",
        undef: true,
        unused: true,
        browser: true,
        maxlen: 80,
        node: true,
        jquery:true,
        globals: {
          ko:false,
          describe: false,
          it: false,
          expect: false,
          runs: false,
          waitsFor: false
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
  grunt.loadNpmTasks("grunt-contrib-jasmine-node");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-dox");

  grunt.registerTask("docs", ["dox"]);
  grunt.registerTask("test", ["jasmine-node", "jshint:files"]);
  return grunt.registerTask("deploy", ["test"]);
};
