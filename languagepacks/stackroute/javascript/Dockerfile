FROM mhart/alpine-node-auto

RUN apk update\
    && npm install -g yarn mocha

RUN mkdir -p /languagepack-languagepack
WORKDIR /languagepack-languagepack

COPY package.json .
RUN yarn

COPY . .

CMD ["yarn", "start"]
