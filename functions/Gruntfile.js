var isWindows = (process.platform === "win32");

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-clean');

  var init = {};

  // execute bash & node commands
  init.exec = {
    tsc: {
      cmd : (isWindows) ? 'bash ./node_modules/.bin/tsc' 
      : './node_modules/.bin/tsc'
    },
    unitTests: {
      cmd: "node ./spec/start-tests.js"
    },
    e2eTests: {
      cmd: "node ./spec/start-integration-tests.js"
    },
    lint: {
      cmd: "npm run lint"
    }
  }

  // watch tasks
  init.watch = {
    dev : {
      files : [
        "src/**/*.ts",
        "spec/**/*.ts"
      ],
      tasks : ["builddev"]
    }
  };

  // clean tasks
  init.clean = {
    options: {
      force: true
    },
    lib: {
      src: ['lib']
    }
  };

  grunt.initConfig(init);

  grunt.registerTask("builddev", [
    "clean:lib",
    "exec:lint",
    "exec:tsc",
    "exec:unitTests"
  ]);

  grunt.registerTask("dev", [
    "builddev", 
    "watch:dev"
  ]);

  grunt.registerTask("test", [
    "exec:unitTests"
  ]);

  grunt.registerTask("e2e", [
    "exec:e2eTests"
  ]);
};