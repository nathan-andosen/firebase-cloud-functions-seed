var Jasmine = require('jasmine');
var Reporter = require('jasmine-terminal-reporter');

// unit tests are in offline mode, they do not connect to firebase
const test = require('firebase-functions-test')();


// mock any config values here, if you use the functions.config() in your 
// functions, like below:
// const functions = require('firebase-functions');
// const key = functions.config().stripe.key;
// Then you can mock it, like this:
// test.mockConfig({ stripe: { key: '23wr42ewr34' }});
test.mockConfig({ running: { env: 'test' }});

const args = require('yargs').argv;
var showOutput = (args.output) ? true : false;
var jasmine = new Jasmine();

process.env.NODE_ENV = 'tests';

jasmine.loadConfigFile('./spec/unit/jasmine.json');

jasmine.onComplete(function(passed) {
  if(passed) {
    console.log('All specs have passed');
  }
  else {
    console.log('At least one spec has failed');
  }
});

// add our reporter
if(showOutput){
  var reporter = new Reporter({
    isVerbose : true
  });
  jasmine.addReporter(reporter);
}

console.log('Starting unit tests...');
jasmine.execute();