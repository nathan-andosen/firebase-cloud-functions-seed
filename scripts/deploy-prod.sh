#!/bin/bash

# IMPORTANT: You must switch to prod environment manually using the command
# npm run switch-to-prod before running the command npm run deploy-prod.
# We do it this way to prevent an accidental deployment to production

./node_modules/.bin/firebase deploy --only functions