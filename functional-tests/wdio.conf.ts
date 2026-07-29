const isInDocker = !!process.env.IN_DOCKER,
	isTeamCity = !!process.env.TEAMCITY_VERSION;

export const config: WebdriverIO.Config = {
	// Use devtools to control Chrome when we're running tests locally
	// Avoids issues with having the wrong ChromeDriver installed via selenium-standalone when Chrome updates every 6 weeks.
	// We need to use webdriver protocol in Docker because we use the selenium grid.
	automationProtocol: isInDocker ? "webdriver" : "devtools",
	runner: "local",
	hostname: "localhost",
	port: 4444,
	maxInstances: isInDocker ? 5 : 1,
	path: "/wd/hub",

	specs: ["./features/**/*.feature"],
	exclude: [
		"./features/**/indicator.feature",
		"./features/**/researchListPage.feature",
		"./features/**/researchPagination.feature",
		"./features/**/filterRrlp.feature",
		"./features/**/hubPage.feature",
	],

	capabilities: [
		{
			acceptInsecureCerts: true, // Because of self-signed cert inside Docker
			// acceptSslCerts: true,
			maxInstances: 1,
			browserName: "chrome",
			// "goog:chromeOptions": {
			// 	args: [
			// 		"--headless",
			// 		"--disable-dev-shm-usage",
			// 		"--no-sandbox",
			// 		"--window-size=1920,1080",
			// 	],
			// },
			// Don't block navigation on full page load (fonts, GTM, cookie-banner
			// CDN etc). DOMContentLoaded is enough: element interactions auto-wait,
			// so a slow third-party resource can't stall `browser.url()` past the
			// cucumber step timeout.
			pageLoadStrategy: "eager",
			"goog:chromeOptions": {
				args: ["--window-size=1920,1080"].concat(
					isInDocker ? "--headless" : []
				),
			},
		},
	],

	logLevel: "error",

	baseUrl: "http://localhost:3000/",
	reporters: [
		"spec",
		isTeamCity && "teamcity",
		isInDocker && [
			"allure",
			{
				useCucumberStepReporter: true,
				// Turn on screenshot reporting for error shots
				disableWebdriverScreenshotsReporting: false,
			},
		],
	].filter(Boolean) as WebdriverIO.Config["reporters"],

	framework: "cucumber",
	cucumberOpts: {
		require: [
			"./steps/**/*.ts",
			"./support/pagePaths.ts",
			"./node_modules/@nice-digital/wdio-cucumber-steps/lib/index.js",
		],
		tagExpression: "not @pending", // See https://docs.cucumber.io/tag-expressions/
		timeout: 60000,
		// Retry a failed scenario once on CI: one-off browser/page-load stalls
		// shouldn't fail the whole build. Genuine failures reproduce on the retry.
		retry: isInDocker ? 1 : 0,
	},

	afterStep: async function (_test, _scenario, { error }) {
		// Take screenshots on error, these end up in the Allure reports
		const fileName = "errorShots/" + "ERROR_" + _scenario.name + ".png";
		if (error) await browser.takeScreenshot();
		if (error) await browser.saveScreenshot(fileName);
	},

	autoCompileOpts: {
		autoCompile: true,
		// see https://github.com/TypeStrong/ts-node#cli-and-programmatic-options
		// for all available options
		tsNodeOpts: {
			transpileOnly: true,
			project: "tsconfig.json",
		},
	},
};
