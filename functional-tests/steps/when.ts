import { When } from "@wdio/cucumber-framework";

import { clickElement } from "@nice-digital/wdio-cucumber-steps/lib/support/action/clickElement.js";

import { getSelector } from "../selectors/index.js";
import {
	clickNewsTab,
	clickInDepthTab,
	clickBlogsTab,
	clickPodcastsTab,
	clickNewslink,
} from "../support/action/clickNewsTab.js";
import { clickSecondPaginationOption } from "../support/action/clickSecondPaginationOption.js";
import { clickSignInButton } from "../support/action/clickSignInButton.js";
import { subscribeNewsletter } from "../support/action/subscribeNewsletter.js";
import { typeInSearchBox } from "../support/action/typeInSearchBox.js";
import { waitForSearchLoad } from "../support/action/waitForSearchLoad.js";
import { waitForTitleToChange } from "../support/action/waitForTitleToChange.js";

When("I search for {}", async (searchTerm: string) => {
	const pageTitle = await browser.getTitle();
	await typeInSearchBox(searchTerm);

	const searchButtonSelector = await getSelector("header search button");
	await clickElement("click", "element", searchButtonSelector);
	await waitForTitleToChange(pageTitle);
	await waitForSearchLoad();
});

When(/^I type "([^"]*)" in the header search box$/, typeInSearchBox);

When(
	/^I click "([^"]*)" in the autocomplete options$/,
	async (text: string) => {
		const pageTitle = await browser.getTitle();

		const optionElement = await $(
			(await getSelector("autocomplete option")) + ":not(.visually-hidden)"
		);
		await optionElement.waitForExist({ timeout: 20000 });

		const anchorSelector = await getSelector("autocomplete anchor");

		// For some reason we can't click on an autocomplete suggestion via wdio's
		// browser.click(element). So we have to use this workaround:
		await browser.execute(
			(text, optionAnchorSelector) => {
				document.querySelectorAll(optionAnchorSelector).forEach((element) => {
					if (
						element.textContent &&
						element.textContent.toLowerCase().indexOf(text.toLowerCase()) > -1
					) {
						(element as HTMLElement).click();
						return;
					}
				});
			},
			text,
			anchorSelector
		);
		await waitForTitleToChange(pageTitle);
	}
);

When(/^I add details to subscribe to newsletters$/, subscribeNewsletter);

When(/^I click the second pagination option$/, clickSecondPaginationOption);

When(/^I click on the news article tab$/, clickNewsTab);

When(/^I click on the in depth tab$/, clickInDepthTab);

When(/^I click on the blogs tab$/, clickBlogsTab);

When(/^I click on the podcasts tab$/, clickPodcastsTab);

When(/^I click on the home news link$/, clickNewslink);

When(/^I can click on the Sign in link$/, clickSignInButton);
