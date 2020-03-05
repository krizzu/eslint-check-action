#!/bin/sh


cd $GITHUB_WORKSPACE

if [ ! -d "node_modules" ]; then
    echo "Repo dependencies not installed. Installing..."
    yarn install
fi

cd "/eslint_check_action" || exit

node "/eslint_check_action/dist/index.js"
