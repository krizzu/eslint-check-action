#!/bin/sh

cd "/eslint_check_action"

yarn install

main=./dist/index.js

if [ ! -f "$main" ]; then
    yarn build
fi

node "$main"
