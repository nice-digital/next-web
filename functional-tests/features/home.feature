Feature: Home page
  As a user of NICE home page

  Background:
    Given I open the home page

  Scenario: User can view home page and navigate to new page
    Then I expect that element ".HomepageLatestNews_title__w_1ni:nth-child(1)" contains the text "Latest from NICE"
    Then I expect that element ".sbRichtextHeading2:nth-of-type(1)" contains the text "Implementation and planning"
    Then I expect that element "h2:nth-child(4)" contains the text "More ways we support you"
    When I scroll to element ".Header_account___MDc2"
    When I click on the element "a[href='/news']"
    Then I expect that element "h1.page-header__heading " contains the text "News, blogs and podcasts"
