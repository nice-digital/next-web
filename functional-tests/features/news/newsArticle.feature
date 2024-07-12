Feature: News tab and article page
  As a user of news tab
  We can see the news tab
  We can click
  As a user I can see the Latest blogs section, Latest podcasts section

  Background:
    Given I open the news, blogs and podcasts page

  Scenario: User can view News tab and sections
    And I pause for 2000ms
    Then I expect that element ".horizontal-nav__link" contains the text "News"
    # And I expect that element "h2.news_sectionContainer__QEy85" contains the text "Latest articles"
    # When I click on the link "a[href='/news/articles']"
    # Then I expect the url to contain "http://localhost:4000/news/articles"
    # And I expect that element "h1.page-header__heading" contains the text "News articles"




    # Scenario: User can click and view each tab
    # And I pause for 2000ms
