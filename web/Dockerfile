FROM node:24.18-alpine

RUN mkdir -p /next-web

COPY package.json /next-web
COPY package-lock.json /next-web

WORKDIR /next-web

RUN apk --no-cache add curl

# Token for the CodeArtifact registry, passed in from the build (--build-arg NPM_TOKEN=...).
# .npmrc is written and removed within a single RUN so the token never persists in a layer.
ARG NPM_TOKEN
RUN echo "registry=https://nice-digital-037931721306.d.codeartifact.eu-west-2.amazonaws.com/npm/npm-internal/" > .npmrc \
	&& echo "//nice-digital-037931721306.d.codeartifact.eu-west-2.amazonaws.com/npm/npm-internal/:_authToken=${NPM_TOKEN}" >> .npmrc \
	&& npm ci --no-audit --quiet \
	&& rm -f .npmrc

COPY ./.next /next-web/.next
COPY ./public /next-web/public
COPY ./config /next-web/config
COPY ./next.config.js /next-web/next.config.js

CMD ["npm", "run", "host"]
