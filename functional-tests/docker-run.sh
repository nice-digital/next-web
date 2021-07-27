#!/bin/bash

# Runs functional tests via Docker

# See https://docs.docker.com/compose/reference/envvars/#compose_project_name
export COMPOSE_PROJECT_NAME=next-web-functional-tests

function cleanupBeforeStart() {
  # Clean up before we start
  rm -rf docker-output && rm -rf allure-results && rm -rf allure-report

  # Avoid "Mount denied" errors for Chrome/Firefox containers on Windows
  # See https://github.com/docker/for-win/issues/1829#issuecomment-376328022
  export COMPOSE_CONVERT_WINDOWS_PATHS=1
}

function runTests() {
  # Wait for the web app to be up before running the tests
  docker-compose run -T test-runner npm run wait-then-test
  # Or for dev mode, uncomment:
  #winpty docker-compose exec test-runner bash
}

function processTestOutput() {
  # Generate an Allure test report
  docker-compose run -T test-runner allure generate --clean

  # Copy logs to use as a TeamCity artifact for debugging purposes
  mkdir -p docker-output
  docker cp test-runner:/next-web/tests/allure-report ./docker-output

  docker-compose logs --no-color > ./docker-output/logs.txt
}

function cleanup() {
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

cleanupBeforeStart
docker-compose up -d --no-recreate
runTests
processTestOutput
cleanup
exitWithCode $error
