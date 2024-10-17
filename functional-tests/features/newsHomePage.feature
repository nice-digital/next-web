Feature: Home page
  As a user of News, Blogs and podcasts page
  As a user I can see the Latest article section

  Background:
    Given I open the news, blogs and podcasts page

  Scenario: User can view news, blogs and podcasts page
    And I pause for 2000ms
    Then I expect that element "h1.page-header__heading" contains the text "News, blogs and podcasts"
    Given I click on the home breadcrumb link
    Then I expect that the url is "http://localhost:3000/"

  Scenario: User can view headings and newsletter alerts banner
    Then I expect that element ".news_sectionContainer__QEy85 h2" contains the text "Latest articles"
    And I expect that element ".tag" contains the text "News"
    And I expect that element ".action-banner__title" contains the text "Sign up for our newsletters and alerts"
    And I expect that element ".horizontal-nav__link" contains the text "News"
    When I click on the element ".horizontal-nav__item:nth-of-type(2)"
    Then I expect that the url is "http://localhost:3000/news/articles"
