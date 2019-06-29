#!/bin/bash

npm run switch-to-staging
./node_modules/.bin/firebase deploy --only functions