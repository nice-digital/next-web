FROM node:18-alpine

WORKDIR /data

COPY package.json /data
COPY package-lock.json /data

RUN npm install

COPY . .
CMD [ "node", "server.js"]

