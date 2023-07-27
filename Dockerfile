FROM node:current-alpine

USER root
RUN apk update && apk add --no-cache tzdata
ENV TZ=Europe/Madrid
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir -p /usr/src/app
RUN chown node:node /usr/src/app

USER node

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

EXPOSE 8080

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --quiet --no-progress && npm cache clean --force

COPY . .

CMD ["node", "index.js"]
