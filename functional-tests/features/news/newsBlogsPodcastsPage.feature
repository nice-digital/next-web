Feature: Home page
  As a user of News, Blogs and podcasts page
  As a user I can see the Latest article section, Latest in-depth section
  As a user I can see the Latest blogs section, Latest podcasts section

  Background:
    Given I open the news, blogs and podcasts page

  Scenario: User can view news, blogs and podcasts page
    And I pause for 2000ms
    Then I expect that element "h1.page-header__heading" contains the text "News, blogs and podcasts"
    Given I click on the breadcrumb Home
    Then I expect the url to contain "/"

  Scenario: User can view news tab navigation
    And I pause for 2000ms
    Then I expect that element "h1.page-header__heading" contains the text "News, blogs and podcasts"
    And I expect that element ".horizontal-nav__link" contains the text "News"
    Given I click on the breadcrumb Home
    Then I expect the url to contain "/"


