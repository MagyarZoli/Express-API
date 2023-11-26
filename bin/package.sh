#!/usr/bin/env bash

# shellcheck disable=SC2034
# shellcheck disable=SC2068
# shellcheck disable=SC2128

GLOBAL=(
  "typescript"
  "pug-cli"
)

SAVE=(
  "nodemon"
  "dotenv"
  "body-parser"
  "marked"
  "ejs"
  "reflect-metadata"
)

SAVEALL=(
  "mongoose"
  "mysql2"
  "express"
  "express-session"
  "validator"
  "cookie-parser"
  "bcrypt"
  "jsonwebtoken"
  "passport"
  "passport-oauth2"
  "passport-google-oauth20"
  "passport-github2"
  "passport-facebook"
  "jquery"
)

TEST=(
  "@babel/core"
  "@babel/cli"
  "@babel/preset-env"
  "@babel/node"
  "jest"
  "eslint"
  "supertest"
  "cross-env"
)

function package() {
  tsSaveAll=()
    for pack in ${SAVEALL[@]}; do
      tsSaveAll+=("@types/$pack")
    done
  npm i -g "${GLOBAL[*]}"
  npm i --save "${SAVE[*]}"
  npm i --save "${SAVEALL[*]}"
  npm i --save-dev "${tsSaveAll[*]}"
  npm i --save-dev "${TEST[*]}"
}

cd ..
package
