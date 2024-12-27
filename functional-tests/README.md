<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Functional tests for Next Web](#functional-tests-for-next-web)
	- [Table of contents](#table-of-contents)
	- [Stack](#stack)
		- [Software](#software)
	- [:rocket: Set up](#rocket-set-up)
		- [Install Java JDK](#install-java-jdk)
		- [Run the tests](#run-the-tests)
		- [Using VSCode](#using-vscode)
		- [Using npm](#using-npm)
			- [Different URLs](#different-urls)
		- [Docker](#docker)
		- [Steps to Run NextWeb in Docker with Teamcity built image](#steps-to-run-nextweb-in-docker-with-teamcity-built-image)
			- [Development mode](#development-mode)
	- [Excluding tests](#excluding-tests)
	- [Running single features](#running-single-features)
	- [Troubleshooting](#troubleshooting)
		- [session not created: This version of ChromeDriver only supports Chrome version xx](#session-not-created-this-version-of-chromedriver-only-supports-chrome-version-xx)
		- [Port 4444 is already in use](#port-4444-is-already-in-use)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Functional tests for Next Web

> Functional, browser-based tests for Next Web, built with WebdriverIO 7

[**:rocket: Jump straight to getting started**](#rocket-set-up)

## Table of contents

- [Functional tests for Next Web](#functional-tests-for-next-web)
	- [Table of contents](#table-of-contents)
	- [Stack](#stack)
		- [Software](#software)
	- [:rocket: Set up](#rocket-set-up)
		- [Install Java JDK](#install-java-jdk)
		- [Run the tests](#run-the-tests)
		- [Using VSCode](#using-vscode)
		- [Using npm](#using-npm)
			- [Different URLs](#different-urls)
		- [Docker](#docker)
		- [Steps to Run NextWeb in Docker with Teamcity built image](#steps-to-run-nextweb-in-docker-with-teamcity-built-image)
			- [Development mode](#development-mode)
	- [Excluding tests](#excluding-tests)
	- [Running single features](#running-single-features)
	- [Troubleshooting](#troubleshooting)
		- [session not created: This version of ChromeDriver only supports Chrome version xx](#session-not-created-this-version-of-chromedriver-only-supports-chrome-version-xx)
		- [Port 4444 is already in use](#port-4444-is-already-in-use)

## Stack

### Software

- [VS Code IDE](https://code.visualstudio.com/)
  - With recommended extensions (VS Code will prompt you to install these automatically)
- [WebdriverIO 7](<[http://.webdriver.io/](https://webdriver.io/)>)
  - [Cucumber.js](https://github.com/cucumber/cucumber-js) for running BDD gherkin-syntax feature files
  - [wdio-cucumber-steps](https://github.com/nice-digital/wdio-cucumber-steps) for shared step definitions for Cucumber JS BDD tests in WebdriverIO
  - [Axe core](https://github.com/dequelabs/axe-core) for automatic accessibility testing
  - [Allure](https://docs.qameta.io/allure/) to generate a test report
- [Docker](https://www.docker.com/) for running the tests in TeamCity against Chrome and Firefox

## :rocket: Set up

### Install Java JDK

WebDriverIO uses selenium under the hood to run the automated browser tests. Selenium in turn uses Java so you will need the Java JDK (Java Development Kit) before you can run tests. Check the _C:\Program Files\Java_ folder and look for _jdk*_ sub folders: this will indicate the JDK installed. In theory you can run `javac -version` on a terminal instead although it doesn't always seem to work so manually checking the folder is a safer option.

At the time of writing JDK 16 is the latest version, but that had issues with WDIO (see [troubleshooting](#troubleshooting)), so using JDK 8 (e.g. 8u301) is the best option.

If you don't have JDK 8 installed, install it from the [Oracle website](https://www.oracle.com/uk/java/technologies/javase/javase-jdk8-downloads.html). You need to register/login to download it but you might be able to find a [direct download](https://javadl.oracle.com/webapps/download/GetFile/1.8.0_301-b09/d3c52aa6bfa54d3ca74e617f18309292/windows-i586/jdk-8u301-windows-x64.exe) from [this gist](https://gist.github.com/wavezhang/ba8425f24a968ec9b2a8619d7c2d86a6) or similar to avoid needing to login.

### Run the tests

Run the tests directly on your machine [using VSCode](#using-vscode), [using npm](#using-npm), or via Docker.

The easiest way is via VSCode:

### Using VSCode

Using VSCode to run the tests will launch browsers on your local machine to run the tests. This is useful for watching and debugging the test runs to diagnose any failing tests.

This runs the tests against the [NextJS web app](../web/) running on http://localhost:3000.

1. Install [Volta](https://volta.sh/) to use the version of Node specified in package.json. Or install Node LTS if you're not using Volta.
2. Install Chrome (and Firefox if you're going to test against multiple browsers)
3. Clone this repository
4. Open the root of the repository in VS Code
   1. use Ubuntu wsl terminal 
5. Install dependencies from npm:
   1. Run 'npm: Install Dependencies' from the VS Code command palette (_Ctrl+Shift+P_) and choose the functional-tests folder from the next dropdown (or just install all)
   2. Or run `cd functional-tests && npm ci` on the command line
6. Run `npm run build` & `npm start` from the _web_ folder to run the NextJS web app on http://localhost:3000
7. You will need the environment variable file '.env.production' on your local machine
8. Run 'Run Test Task' from the command palette (_Ctrl+Shift+P_) and choose 'Functional tests - all'
   1. Or run 'Functional tests - current feature' to run just the currently opened feature file.

Depending on your use case, you can run the tests against [different URLs](#different-urls) instead of http://localhost:3000.

### Using npm

The VSCode instructions above use npm under the hood to run the tests. Run the npm commands via the command line if you prefer.

Follow the instructions from the [VSCode](#using-vscode) section above, but instead of running the test from the VSCode debug window, run `npm test` from the _functional-tests_ folder.

#### Different URLs

Use the `-b` (or `--baseUrl`) [CLI parameter](https://webdriver.io/docs/clioptions/) from WebdriverIO to override the URL for the tests.

For example, to run against the test environment:

```sh
npm test -- -b https://test.nice.org.uk/
```

### Docker

We run the tests in Docker on TeamCity because it allows us to spin up a self-contained application, and selenium grid with both Chrome and Firefox. The Teamcity steps have been configured to build and test the actual production image before it is sent to AWS ECR. If the tests fail then the image won't be copied to ECR. 

You can run this same stack locally inside Docker.

It can be harder to debug tests running inside Docker as you can't watch the tests run in the browser, but we do save error screenshots and logs into the docker-output folder for debugging.

1. Install [Volta](https://volta.sh/) to use the version of Node specified in package.json. Or install Node LTS if you're not using Volta.
2. Build the [Next JS](../web/):
   1. `cd web && npm run build`
3. Install Docker
4. Open bash and `cd` into the _functional-tests_ folder
5. You will need the environment variable file 'local-xxx.yml' on your local machine
6. Run `docker-compose build`
   1. This downloads all the required images from Docker
   2. So it takes a while but it will cache everything so will be quicker next time
   3. If you get AWS error access to nextweb container, you will need to get access. Check out the step below;
      1. [Steps to Run NextWeb in Docker with Teamcity built image](#steps-to-run-nextweb-in-docker-with-teamcity-built-image)
7. Run `./docker-run.sh`
   1. This builds the docker network, runs the tests and copies outputs in the _docker-output_ folder.

> View the [docker-compose.yml](docker-compose.yml) file to understand the structure of the Docker network and the links between containers.
>
> 

### Steps to Run NextWeb in Docker with Teamcity built image

1. **Verify AWS CLI Installation**
   - Run `aws sts get-caller-identity` to confirm the AWS CLI is installed and configured correctly. You should see your username/account information.

1. **Login to AWS ECR**
   - Use the command below to log into AWS ECR. Replace `xxxxxxxxxxxxxx` with your AWS account details:
     ```bash
     aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin xxxxxxxxxxxxxx.dkr.ecr.eu-west-1.amazonaws.com
     ```

1. **Check Docker in WSL**
   - Confirm Docker is working in WSL by running:
     ```bash
     docker run hello-world
     ```

1. **Pull NextWeb Image**
   - Obtain the 4-digit build number from Teamcity, then pull the NextWeb image:
     ```bash
     docker pull .dkr.ecr.eu-west-1.amazonaws.com/nextweb:nnnn
     ```
   - Replace `nnnn` with the build number.

1. **Navigate to the Functional Tests Directory**
   - Change to the directory containing the `docker-compose.yml` file:
     ```bash
     cd /functional-tests
     ```

1. **Update Docker Compose File**
   - Edit the `docker-compose.yml` file to specify the correct image for the "next-web" container. Replace `xxxx` with the build number from Step 4:
     ```yaml
     xxxxxxxxxxxxxx.dkr.ecr.eu-west-1.amazonaws.com/nextweb:xxxx
     ```

1. **Redirect NextWeb Error Logs (Optional)**
   - To send logs to the local console instead of pino-mq and the RELK stack, uncomment the following line in the `docker-compose.yml` file:
     ```yaml
     command: ["npm", "run", "host-console-logging"]
     ```

1. **Start Docker Containers**
   - Bring up all containers defined in the `docker-compose.yml` file:
     ```bash
     docker-compose up
     ```

1. **Verify Running Containers**
   - Ensure all containers are running using either:
     - `docker container ls`
     - Docker Desktop UI

1. **Run Test Suite**
    - Once satisfied that the containers are running, execute the test container:
      ```bash
      docker-compose run -T nxt-test-runner npm run wait-then-test
      ```


#### Development mode

Using _docker-run.sh_ is great for running the tests one off inside Docker, but it creates the Docker network then destroys everything after the test run. This means slow cycle times for chaning feature files (or step definitions) and re-running the test(s).

Instead, we can run the following command:

```sh
docker-compose up -d && docker-compose run test-runner bash
```

This runs the docker network in 'detached' mode, which leaves the containers running. It then runs bash against the test runner container. This allows us to then run the tests from within the Docker network, but the NextJS web app runs on http://next-web-tests.nice.org.uk:8092 inside Docker so we have a simple npm alias command to run the tests within Docker:

```sh
npm run test:docker
```

Examine the scripts within [package.json](package.json) to see how the URL is being overriden within this command.

The whole functional-tests folder is mounted as a volume in the test-runner container. This means any screenshots generated in the case of an error are saved into the screenshots folder, and these are available on the host machine.

> Note: run `exit` to escape from bash inside the test-runner container, and run `docker-compose down` to stop the Docker network.



## Excluding tests

Exclude tests by using the `@pending` [cucumber tag](https://github.com/cucumber/cucumber/wiki/Tags).

## Running single features

To run a single feature file, use the following command:

```sh
npm test -- --spec ./features/guidance-list.feature
```

> Note: you can pass in multiple files, separated by a comma.

Or you can use a keyword to filter e.g.:

```sh
npm test -- --spec homepage
```

Note: this can be combined with other options, for example to run _just_ the search page tests against the live website, run:

```sh
npm test -- --spec search --baseUrl http://www.nice.org.uk
```

Finally, if you've grouped your specs into suites you can run and individual suite with:

```sh
npm test -- --suite homepage
```

See [organizing test suites](https://webdriver.io/docs/organizingsuites/) in the WebdriverIO docs for more info.



## Troubleshooting

### session not created: This version of ChromeDriver only supports Chrome version xx

This usually occurrs after updating Chrome on your PC. When you run `npm i` (or `npm ci`), there's a package called _selenium-standalone_ that downloads the _latest_ ChromeDriver binaries at the point of install. This binary is tied to a specific Chrome version, so if you update Chrome there's then a mismatch. So run `npm rebuild selenium-standalone` to reinstall the package and update the Chromedriver binary to the latest.

### Port 4444 is already in use

This occurs when the Selenium server isn't shutdown properly after a test run. We found this with JDK 16 so make sure you have JDK 8 instead.


