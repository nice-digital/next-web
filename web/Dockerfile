FROM node:14-alpine

RUN mkdir -p /next-web

COPY package.json /next-web
COPY package-lock.json /next-web

WORKDIR /next-web

RUN npm ci --no-audit --quiet

COPY ./.next /next-web/.next
COPY ./public /next-web/public
COPY ./config /next-web/config
COPY ./next.config.js /next-web/next.config.js

CMD ["npm", "start"]
