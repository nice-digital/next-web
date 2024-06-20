#!/bin/bash

# Runs functional tests via Docker

# Avoid "Mount denied" errors for Chrome/Firefox containers on Windows
# See https://github.com/docker/for-win/issues/1829#issuecomment-376328022
export COMPOSE_CONVERT_WINDOWS_PATHS=1

function cleanupBeforeStart() {
  # Clean up before we start
  rm -rf docker-output && rm -rf allure-results && rm -rf allure-report
}

function runTests() {
  if [[ -v TEAMCITY_VERSION ]]; then
    # Assume that on TeamCity we've created the containers in the background but not started them
    # docker-compose start
    docker-compose up -d
  else
    docker-compose up -d
  fi

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

  echo "Copying allure report out of nxt-test-runner"
  docker cp nxt-test-runner:/next-web/tests/allure-report ./docker-output

  echo "Copying docker logs from docker to logs.txt"
  docker-compose logs --no-color > ./docker-output/logs.txt

  # echo "Copying PM2 logs out to pm2-logs.txt"
  # docker-compose exec -T next-web pm2 logs --nostream --lines 1000 > ./docker-output/pm2-logs.txt
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

echo "List Docker Images"
docker image ls
echo "End of List Docker Images"

# echo "Docker logout"
# docker logout
# echo "Docker logedout"

echo "Docker cleanupBeforeStart"
cleanupBeforeStart
echo "Docker cleanupBeforeStart Ended"

echo "Docker runTests"
runTests
echo "Docker runTests Ended"

echo "Docker processTestOutput"
processTestOutput
echo "Docker processTestOutput Ended"

echo "Docker cleanup"
cleanup
echo "Docker cleanup Ended"

exitWithCode $error
