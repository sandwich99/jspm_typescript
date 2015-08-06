#!/usr/bin/env bash
#
# Script to delpoy to server
# - install required node packages
# - install Karma
# - install git hooks


node=`which node 2>&1`
if [ $? -ne 0 ]; then
  echo "Please install NodeJS."
  echo "http://nodejs.org/"
  exit 1
fi

npm=`which npm 2>&1`
if [ $? -ne 0 ]; then
  echo "Please install NPM."
fi


gulp=`which gulp 2>&1`
if [ $? -ne 0 ]; then
  echo "Please install Gulp."
fi


gulp dist