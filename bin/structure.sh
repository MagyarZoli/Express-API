#!/usr/bin/env bash

# shellcheck disable=SC2034
# shellcheck disable=SC2054
# shellcheck disable=SC2068
# shellcheck disable=SC2103
# shellcheck disable=SC2164
# shellcheck disable=SC2218

SRC=("services" "models" "controllers" "middleware" "exceptions")

function makeSrcDir() {
  mkdir src
  cd src
  mkdir main
  cd main
  mkdir javascript
  cd javascript
  for dir in ${SRC[@]}; do
    if [ ! -e "$dir" ]; then
      mkdir "$dir"
    fi
  done
  cd ..
  cd ..
  mkdir test
  cd test
  mkdir javascript
  cd javascript
  for dir in ${SRC[@]}; do
    if [ ! -e "$dir" ]; then
      mkdir "$dir"
    fi
  done
  cd ..
  cd ..
  cd ..
}

cd ..
mkdir public
mkdir views
makeSrcDir
