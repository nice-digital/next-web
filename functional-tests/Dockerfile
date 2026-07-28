FROM node:22.19-alpine

ENV IN_DOCKER=true

# Install Java (for Allure) see https://stackoverflow.com/a/44154721/486434
RUN apk add openjdk8

# Curl isn't in Alpine and needed to install allure
RUN apk add curl

# Install Allure for generating a report
RUN curl -o allure-2.14.0.tgz -Ls https://repo1.maven.org/maven2/io/qameta/allure/allure-commandline/2.14.0/allure-commandline-2.14.0.tgz \
	&& tar -zxf allure-2.14.0.tgz -C /usr/local --strip-components=1 \
  && rm allure-2.14.0.tgz

RUN mkdir -p /next-web/tests

# We have a monorepo, and extend from the root tsconfig. All we need is an empty one for TypeScript to work properly
RUN echo "{}" > /next-web/tsconfig.json

COPY package.json /next-web/tests
COPY package-lock.json /next-web/tests

WORKDIR /next-web/tests

# Token for the CodeArtifact registry, passed in from the host (see docker-compose.yml).
# .npmrc is written and removed within a single RUN so the token never persists in a layer.
ARG NPM_TOKEN
RUN echo "registry=https://nice-digital-037931721306.d.codeartifact.eu-west-2.amazonaws.com/npm/npm-internal/" > .npmrc \
	&& echo "//nice-digital-037931721306.d.codeartifact.eu-west-2.amazonaws.com/npm/npm-internal/:_authToken=${NPM_TOKEN}" >> .npmrc \
	&& npm ci --no-audit --quiet \
	&& rm -f .npmrc

COPY . /next-web/tests

# Keep the container running so we can run commands in the container when we want
CMD tail -f /dev/null
