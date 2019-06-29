#!/bin/bash

./node_modules/.bin/firebase use staging
./node_modules/.bin/firebase functions:config:set running.env=staging