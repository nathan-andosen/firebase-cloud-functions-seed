# Firebase cloud functions seed

A repo to kickstart your next typescript cloud functions Firebase project. This is mainly a seed app for HTTP Api function based app.

## Key Features:

* __Typescript__ - typed superset of JavaScript
* __Automation__ - automated tasks to build, deploy and run tests via GruntJs
* __Unit & Integration tests__ - These tests are setup and ready to go, some example tests for a helping start.
* __Single function execution__ - Only load the function that is being executed, speeds up cold starts.
* __Zero dependencies__ - No loading of third party libraries, great for performance
  * There are helper classes and services provided in the seed app that you will probably use in every project. These include: _Authentication service_, _Dependency injection service_, _CORS service_ and more. 

# Getting started

To start your new cloud functions firebase project using this seed app, follow the steps below:

1. Create your Firebase project in the Firebase console. At a minimum, create  your dev project. Most of the time you will create three separate projects, once for dev, one for staging and one for production. So for example, you may have: _my-propject-dev_, _my-project-staging_, _my-project-prod_.

1. Clone this repository to a new directory:

```
git clone https://github.com/nathan-andosen/firebase-cloud-functions-seed.git my-project
```

3. Remove the git origin

```
cd my-project-name
git remote rm origin
```

4. Now create a _.firebaserc_ file with the following content: _(Replace the ``<project-id>`` tokens with your project ids. For now, you might only have a dev project id, thats fine, just add that project id to all project aliases)_

```json
{
  "projects": {
    "dev": "<project-id>",
    "staging": "<project-id>",
    "prod": "<project-id>"
  }
}
```

5. Now run the command ``npm run init``. _This will install your node_modules._

5. Create our Service account key: _/project-data/service-account-key.json_ file. Follow the steps here: https://firebase.google.com/docs/functions/local-emulator. This allows us to emulate HTTP functions locally. Make sure the file is in the _/project-data_ directory. Replace all the ``<token>`` placeholders with your project data.

```json
{
  "type": "service_account",
  "project_id": "<project-id>",
  "private_key_id": "<key-id>",
  "private_key": "<private-key>",
  "client_email": "<client-email>",
  "client_id": "",
  "auth_uri": "<auth-uri>",
  "token_uri": "<token-uri>",
  "auth_provider_x509_cert_url": "<auth-provider-cert-url>",
  "client_x509_cert_url": "<client-cert-url>"
}
```

7. Now create a _/project-data/integration-test-data.js file with the contents below _(You must replace the content with your project data)_. This data should come from your dev project, not your staging or production. _(Unless you want to run your e2e tests against staging)_. Replace all the ``<token>`` placeholders with your project data.

```javascript
// Find this in your firebase console: Project settings => General tab
var projectId = "<project-id>";

// Find this in your firebase console: Project settings => General tag
var webApiKey = "<web-api-key>";

// Find this in your firebase console: Project settings => Cloud Messaging tab
var cloudMessagingSenderId = "<sender-id>";

// Find this in your firebase console: Project settings => Service accounts tab
var databaseUrl = "https://" + projectId + ".firebaseio.com";

exports.testData = {
  projectId: projectId,
  apiKey: webApiKey,
  authDomain: projectId + ".firebaseapp.com",
  databaseURL: databaseUrl,
  messagingSenderId: cloudMessagingSenderId

  // Comment in if you need storage bucket for testing
  // storageBucket: "<storage-bucket>",
};
```

8. Update your package.json file as needed. For example, update the _name_ and _description_ properties.

8. Done.

# Deployments

### Dev

1. Run the build and unit tests first: ``npm run build``

1. Deploy to Firebase: ``npm run deploy``

1. Now you can run integration tests against Firebase: ``npm run e2e``

### Staging

1. Run the build and unit tests first: ``npm run build``

1. Deploy to Firebase: ``npm run deploy-staging``

### Production

1. First deploy to dev env and make sure all unit & e2e tests pass

1. Now deploy to staging env and test your app

1. Now oyu can deploy to production: First switch to prod: ``npm run switch-to-prod``

1. Deploy to Firebase: ``npm run deploy-prod``

# Development

``npm run dev`` - Command to run when developing on this project. Will watch for file changes, compile typescript and run unit tests _(which are offline, they do not connect to Firebase)_

``npm run test`` - Run the unit tests

``npm run e2e`` - Run the end 2 end (integration) tests. __Important:__ Integration tests connect to firebase, they run in online mode.

``npm run build`` - Will build the cloud functions: compile typescript, run the unit tests.

# Helpful Information

### Environment

The app knows which environment its running in by the config option:

```javasciprt
functions.config().running.env
```

__Environments available:__ 

* __prod__ - When running in the Firebase project used for production.
* __staging__ - When running in the Firebase project used for staging.
* __dev__ - When running in the Firebase project used for development and integration tests.
* __test__ - When running unit tests, which is in offline mode, Firebase services do not connect to the Firebase project in Google Cloud.

Authentication is only active in prod environment. In dev or test environment, you should set the request header X-Uid to your user uid (this is a way to fake a uid that would be in an auth token).

### Testing

_Some cloud functions are only created for dev / debugging purposes, so they only have unit tests, and maybe some basic integration tests._

__Unit tests:__

* Run in offline mode, meaning the Firebase services do not connect to the Firebase project

__Integration tests:__

* Run in online mode, they connect to the Firebase services, they should connect to the dev project, not the production project.

# Function template

Blank function template to use when creating a cloud function

```javascript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { HttpFunction } from '../http-function.abstract';
import { Err } from '../../models/err.model';

class SearchUser extends HttpFunction {

  private validateRequest(data): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if(false) {
        reject(new Err('Invalid parameters', { status: 400 }));
        return;
      }
      resolve(true);
    });
  }

  execute(req: functions.Request, res: functions.Response) {
    return this.cors(req, res, () => {
      return this.authenticateSrv.authenticate(req, admin.auth())
      .then((decodedToken) => {
        return this.validateRequest(req.body);
      })
      .then(() => {
        this.apiResponseSrv.send(res, { message: "success" });
        return Promise.resolve();
      })
      .catch((err) => {
        this.apiResponseSrv.sendError(res, err);
        return Promise.resolve();
      });
    });
  }
}

// export our function for Firebase
export const searchUser = functions.https.onRequest((req, res) => {
  return new SearchUser().execute(req, res);
});
```

# License

MIT