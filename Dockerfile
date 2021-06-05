FROM node:14.15-alpine

WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY . /app/

RUN npm install -g typescript
RUN npm install

ENV PORT 3000
ENV MONGO_STRING mongodb://user1:0H8HxO28@rc1a-935z85al8b5e971m.mdb.yandexcloud.net:27018/marketplace?replicaSet=rs01&authSource=marketplace

EXPOSE $PORT

CMD [ "npm", "start" ]
