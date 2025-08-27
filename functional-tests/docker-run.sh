#!/bin/bash

# set env var for the functional test step then env var config overrides work
export FUNCTIONAL_TESTS=true

# Runs functional tests via Docker

# Avoid "Mount denied" errors for Chrome/Firefox containers on Windows
# See https://github.com/docker/for-win/issues/1829#issuecomment-376328022
export COMPOSE_CONVERT_WINDOWS_PATHS=1

function cleanupBeforeStart() {
  # Clean up before we start
  rm -rf docker-output && rm -rf allure-results && rm -rf allure-report
}

function runTests() {
  # Bring up images including the one that will be sent to AWS ECR
  docker-compose up -d

  # Debug: print environment variables inside nxt-test-runner
  echo "==== TeamCity ENV VARS inside nxt-test-runner ===="
  docker-compose run --rm nxt-test-runner env | grep -E 'FUNCTIONAL_TESTS|SEARCH_BASE_URL|PUBLICATIONS_BASE_URL|INDEV_BASE_URL|STORYBLOK_TOKEN|JOTFORM'
  echo "==============================================="


  # Wait for the web app to be up before running the tests
  docker-compose run -T nxt-test-runner npm run wait-then-test
  # Or for dev mode, uncomment:
  #winpty docker-compose exec test-runner sh
}

function processTestOutput() {
  # Generate an Allure test report
  docker-compose run -T nxt-test-runner allure generate --clean

  # Copy logs to use as a TeamCity artifact for debugging purposes
  echo "Making docker-output folder"
  mkdir -p docker-output

  docker cp nxt-test-runner:/next-web/tests/errorShots ./docker-output/errorShots

  echo "Copying allure report out of nxt-test-runner"
  docker cp nxt-test-runner:/next-web/tests/allure-report ./docker-output

  echo "Copying docker logs from docker to logs.txt"
  docker-compose logs --no-color > ./docker-output/logs.txt
}

function cleanup() {
  echo "Cleaning up in the background"
  # Stop in the background so the script finishes quicker - we don't need to wait
  nohup docker-compose down --remove-orphans --volumes > /dev/null 2>&1 &
}

function exitWithCode()
  {
    echo "exit code is: $1"
    if [ "$1" -gt 0 ]
    then
      exit 1
    else
      exit 0
    fi
  }

error=0
trap 'catch' ERR
catch() {
  error=1
}

docker image ls
cleanupBeforeStart
runTests
processTestOutput
cleanup

exitWithCode $error
