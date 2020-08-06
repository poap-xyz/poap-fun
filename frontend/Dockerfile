FROM node:12.13.0

WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install

CMD ["yarn", "start"]
