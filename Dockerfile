FROM node:14.15.5-alpine3.13
EXPOSE 5555

ENV APP_HOME=/app/bin \
    NPM_RUN=start \
    NAME=nodejs

ENV HOME=${APP_HOME} \
    NPM_CONFIG_PREFIX=${APP_HOME}/.npm 

COPY . ${APP_HOME}

WORKDIR ${APP_HOME}

RUN npm install && npm run prod:build
CMD node ./dist/server.js