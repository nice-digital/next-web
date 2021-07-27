FROM node:14-alpine

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

RUN npm ci --no-audit --quiet

COPY . /next-web/tests

# Keep the container running so we can run commands in the container when we want
CMD tail -f /dev/null
