import { Then } from "@wdio/cucumber-framework";
 
Then('I expect that element {string} contains the text {string}', async (selector, expectedText) => {
    const element = await browser.$(selector);
    const actualText = await element.getText();
    expect(actualText).toContain(expectedText);
});