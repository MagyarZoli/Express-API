#!/usr/bin/env bash

# shellcheck disable=SC2034
# shellcheck disable=SC2006

cd ..
npm init -y
npm i express nodemon dotenv
npm i --save-dev @babel/core @babel/cli @babel/preset-env @babel/node jest eslint supertest cross-env

babelrc=".babelrc"
babelrcContent="{
  \"presets\": [\"@babel/preset-env\"],
  \"plugins\": [\"@babel/plugin-syntax-import-assertions\"]
}"
echo "$babelrcContent" > "$babelrc"

gitignore=".gitignore"
gitignoreContent="node_modules
.env"
echo "$gitignoreContent" > "$gitignore"

eslintrc=".eslintrc.js"
eslintrcContent="module.exports = {
  \"env\": {
    \"node\": true,
    \"es2020\": true,
    \"jest\": true
  },
  \"extends\": \"eslint:recommended\",
  \"rules\": {
    \"no-multiple-empty-lines\": \"warn\",
    \"no-var\": \"error\",
    \"prefer-const\": \"error\"
  }
};"
echo "$eslintrcContent" > "$eslintrc"

eslintignore=".eslintignore"
eslintignoreContent="public/"
echo "$eslintignoreContent" > "$eslintignore"

editorconfig=".editorconfig"
editorconfigContent="root = true

[*]
indent_style = space
indent_size = 2
end_of_line = LF
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false"
echo "$editorconfigContent" > "$editorconfig"

touch .env
touch .env.example
