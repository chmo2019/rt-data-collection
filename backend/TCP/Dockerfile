FROM node:22-bookworm

ENV APP=/app

WORKDIR $APP

COPY package.json $APP

RUN npm install

COPY . $APP

EXPOSE 7070

CMD [ "node", "server.js" ]