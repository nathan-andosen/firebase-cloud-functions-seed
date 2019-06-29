import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// our unit tests will initialize a blank app, so we need to check if an 
// app has already been initialized so we dont get errors
if(admin.apps.length === 0) {
  admin.initializeApp(functions.config().firebase);
}

const firestore = admin.firestore();
firestore.settings({
  timestampsInSnapshots: true
});

// we only load the function that is being executed, this should speed up
// cold start times

const funcName = process.env.FUNCTION_NAME;

const helloWorldFunc = 'helloWorld';
if (!funcName || funcName === helloWorldFunc) {
  exports[helloWorldFunc] 
    = require('./functions/hello-world/hello-world')[helloWorldFunc];
}