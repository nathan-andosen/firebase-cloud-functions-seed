#!/bin/bash

./node_modules/.bin/firebase use dev
./node_modules/.bin/firebase functions:config:set running.env=dev