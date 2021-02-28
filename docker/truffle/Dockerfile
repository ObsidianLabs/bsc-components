FROM node:12-alpine

RUN apk add --no-cache docker-cli

RUN npm -g config set user root && npm i -g alaya-truffle@0.13.2 && npm cache clean --force
