#!/bin/bash

./node_modules/.bin/firebase use prod
./node_modules/.bin/firebase functions:config:set running.env=prod