import { Then } from "@wdio/cucumber-framework";
import { expect } from "expect-webdriverio";

import { pause } from "@nice-digital/wdio-cucumber-steps/lib/support/action/pause.js";
import { waitForDisplayed } from "@nice-digital/wdio-cucumber-steps/lib/support/action/waitForDisplayed.js";
import { checkContainsText } from "@nice-digital/wdio-cucumber-steps/lib/support/check/checkContainsText.js";

import { getSelector } from "../selectors/index.js";
import { clickNextPagination } from "../support/action/clickNextPagination.js";
import { clickPreviousPagination } from "../support/action/clickPreviousPagination.js";
import { clickSignUpButton } from "../support/action/clickSignInButton.js";
import {
	indicatorList,
	indicatorHistory,
} from "../support/check/indicatorList.js";
import {
	validateBlogAuthorImage,
	validateBlogAuthorName,
	validateBlogAuthorTitle,
	validateRelatedNewsStory,
} from "../support/check/validateBlogPage.js";
import {
	validateHomeSection,
	validateHomeSectionLink1,
	validateHomeSectionLink2,
} from "../support/check/validateHomePage.js";
import {
	validateIndicatorPageResultCount,
	validateFirstLinkInPagination,
	validateIndicatorPageNoResultCount,
} from "../support/check/validateIndicatorPageResultCount.js";
import {
	validateNewsArticleTag,
	validateInDepthTag,
	validateBlogsTag,
	validatePodcastsTag,
	validateNewsArticlePagination,
} from "../support/check/validateNewsArticleTag.js";
import {
	validateNewsHomePage,
	validateIndicatorHeading,
	validateIndicatorNavItem1,
	validateIndicatorNavItem2,
	validateHubHeading,
	validateHubTableText,
} from "../support/check/validateNewsHomePage.js";
import { validateUrl } from "../support/check/validateUrl.js";

Then(
	/^I expect to see "([^"]*)" in the autocomplete suggestions$/,
	async (text: string) => {
		const optionElement = await $(
			(await getSelector("autocomplete option")) + ":not(.visually-hidden)"
		);
		await optionElement.waitForExist({ timeout: 20000 });

		const menuSelector = await getSelector("autocomplete menu");
		await checkContainsText("element", menuSelector, "", text);
	}
);

Then(/^I expect to see the overview and indicator list item$/, indicatorList);
Then(/^I expect to see the indicator history$/, indicatorHistory);

Then(
	/^I expect the result list count contains "([^"]*)"$/,
	validateIndicatorPageResultCount
);

Then(
	/^I expect the result list count shows "([^"]*)"$/,
	validateIndicatorPageNoResultCount
);

Then(
	/^I expect the first pagination option is "([^"]*)"$/,
	validateFirstLinkInPagination
);

Then(/^I click the next page option$/, clickNextPagination);
Then(/^I click the previous page option$/, clickPreviousPagination);

Then(
	/^I expect the news articles tag contains the text "([^"]*)"$/,
	validateNewsArticleTag
);

Then(
	/^I expect the in Depth tag contains the text "([^"]*)"$/,
	validateInDepthTag
);

Then(/^I expect the blogs tag contains the text "([^"]*)"$/, validateBlogsTag);
Then(
	/^I expect the podcasts tag contains the text "([^"]*)"$/,
	validatePodcastsTag
);

Then(
	/^I expect the pagination shows the text "([^"]*)"$/,
	validateNewsArticlePagination
);

Then(
	/^I expect to see the page heading contains the text "([^"]*)"$/,
	validateNewsHomePage
);

Then(
	/^I click the sign up for newsletter and alerts button$/,
	clickSignUpButton
);
Then(
	/^I expect to see the indicator page heading contains the text "([^"]*)"$/,
	validateIndicatorHeading
);

Then(
	/^I expect to see the first horizontal nav item contains the text "([^"]*)"$/,
	validateIndicatorNavItem1
);

Then(
	/^I expect to see the second horizontal nav item contains the text "([^"]*)"$/,
	validateIndicatorNavItem2
);
Then(
	/^I expect to see the hub page heading contains the text "([^"]*)"$/,
	validateHubHeading
);

Then(/^I see table contains the text "([^"]*)"$/, validateHubTableText);
Then(
	/^I expect to see the section heading contains the text "([^"]*)"$/,
	validateHomeSection
);
Then(
	/^I expect to see the section heading link contains the text "([^"]*)"$/,
	validateHomeSectionLink1
);
Then(
	/^I expect to see another section heading link contains the text "([^"]*)"$/,
	validateHomeSectionLink2
);

Then(/^I expect to see blog author image does exist$/, validateBlogAuthorImage);
Then(
	/^I expect to see blog author name contains the text "([^"]*)"$/,
	validateBlogAuthorName
);

Then(
	/^I expect to see blog author title contains the text "([^"]*)"$/,
	validateBlogAuthorTitle
);
Then(
	/^I expect to see related news stories contains the text "([^"]*)"$/,
	validateRelatedNewsStory
);
Then(/^I expect the url is "([^"]*)"$/, validateUrl);
Then(
	/^I expect to see the heading contains the text "([^"]*)"$/,
	async (text: string) => {
		await waitForDisplayed("h2:nth-of-type(2)", "");
		await checkContainsText("element", "h2:nth-of-type(2)", "", text);
		await pause("2000");
	}
);
Then(
	/^I expect subscribe to update for primary care jotform Id to exist$/,
	async () => {
		const iframe = await $("#JotFormIFrame-232421799357869");
		await iframe.waitForExist({ timeout: 20000 });
		await iframe.scrollIntoView();
		await expect(await $(iframe)).toBeDisplayed();
	}
);
Then(/^I expect website feedback page jotform Id to exist$/, async () => {
	const iframe = await $("#JotFormIFrame-222773673466870");
	await iframe.waitForExist({ timeout: 20000 });
	await iframe.scrollIntoView();
	await expect(await $(iframe)).toBeDisplayed();
});
