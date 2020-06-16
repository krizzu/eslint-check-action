#!/bin/sh


cd $GITHUB_WORKSPACE

if [ ! -d "node_modules" ]; then
    echo "Repo dependencies not installed. Installing..."
    [ -f yarn.lock ] && yarn install
    [ -f package-lock.json ] && npm install
fi

cd "/eslint_check_action" || exit

node "/eslint_check_action/dist/index.js"
