var Jasmine = require('jasmine');
var Reporter = require('jasmine-terminal-reporter');
var path = require('path');
var projectData = require('../../project-data/e2e-test-data.js');
var keyPath = path.join(__dirname, '../', '../', 'project-data', 
  'service-account-key.json');

const test = require('firebase-functions-test')(projectData.testData, keyPath);

// mock any config values here, if you use the functions.config() in your 
// functions, like below:
// const functions = require('firebase-functions');
// const key = functions.config().running.env;
// Then you can mock it, like this:
test.mockConfig({ running: { env: 'test' }});

const args = require('yargs').argv;
var showOutput = (args.output) ? true : false;
var jasmine = new Jasmine();

process.env.NODE_ENV = 'tests';

jasmine.loadConfigFile('./spec/e2e/jasmine.json');
jasmine.onComplete(function(passed) {
  if(passed) {
    console.log('All specs have passed');
  }
  else {
    console.log('At least one spec has failed');
  }
});

// add our reporter
// if(showOutput){
var reporter = new Reporter({
  isVerbose : true,
  includeStackTrace: true
});
jasmine.addReporter(reporter);
// }

console.log('Starting e2e tests...');
jasmine.execute();